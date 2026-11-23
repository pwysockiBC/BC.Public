// Accepts one application: spam checks, the contract's rules, save with a new reference number,
// then the confirmation email. Once the application is saved, nothing after it can fail the request.

using BC.Public.Phc.Data;
using BC.Public.Phc.Data.Entities;
using BC.Public.Phc.Features.Form;
using BC.Public.Phc.Shared.Email;
using BC.Public.Phc.Shared.Errors;
using BC.Public.Phc.Shared.Spam;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BC.Public.Phc.Features.Applications;

public class ApplicationService(
    PhcDbContext db,
    FormTokens formTokens,
    EmailSender email,
    IOptions<PhcOptions> phcOptions,
    ILogger<ApplicationService> logger)
{
    // Shown as CreatedBy on staff screens.
    public const string CreatedBy = "Public form";

    private const int MaxReferenceAttempts = 3;
    private const int MaxEmailErrorLength = 2000;

    // The project an application is for: what the rules and the email need.
    private sealed class OpenProject
    {
        public required int Id { get; init; }
        public required string Name { get; init; }
        public required DateOnly EventDate { get; init; }
    }

    public async Task<SubmitApplicationResult> SubmitAsync(SubmitApplicationRequest request, CancellationToken ct)
    {
        // 1. Bots. A filled honeypot gets a normal-looking answer and nothing is saved.
        if (!string.IsNullOrWhiteSpace(request.Homepage))
        {
            logger.LogInformation("Application dropped: honeypot field was filled.");
            return new SubmitApplicationResult { ReferenceNumber = ReferenceNumbers.New(), ConfirmationEmailSent = true };
        }
        CheckFormToken(request.FormToken);

        // 2. The project must be open right now.
        var now = DateTime.UtcNow;
        var project = await OpenProjects.Query(db, now)
            .Where(p => p.Id == request.ProjectId)
            .Select(p => new OpenProject { Id = p.Id, Name = p.Name, EventDate = p.EventDate })
            .FirstOrDefaultAsync(ct)
            ?? throw new ValidationException("projectId", "Applications for this project have closed.");

        // 3. The contract's rules, then the choices that need the database.
        var errors = new ValidationErrors();
        var today = DateOnly.FromDateTime(DateTime.Now);
        ApplicationRules.Check(request, project.EventDate, today, phcOptions.Value.AgreementsVersion, errors);

        var regionIds = new List<int>();
        if (request.Participation.StreetTeam)
        {
            regionIds = request.StreetTeamRegionIds.Distinct().ToList();
        }
        var regionNames = await CheckRegionsAsync(project.Id, regionIds, errors, ct);
        var languageIds = request.SpokenLanguageIds.Distinct().ToList();
        await CheckLanguagesAsync(languageIds, errors, ct);
        errors.ThrowIfAny();

        // 4. Save.
        var registration = BuildRegistration(request, project.Id, now, regionIds, languageIds);
        await SaveWithNewReferenceAsync(registration, ct);
        logger.LogInformation("Application {RegistrationId} saved as {ReferenceNumber}.", registration.Id, registration.ReferenceNumber);

        // 5. Email. Not cancelled if the browser goes away: the application is already saved,
        // and the outcome should still be recorded.
        var sent = await SendConfirmationAsync(registration, project, regionNames);

        return new SubmitApplicationResult { ReferenceNumber = registration.ReferenceNumber, ConfirmationEmailSent = sent };
    }

    private void CheckFormToken(string? token)
    {
        switch (formTokens.Check(token))
        {
            case FormTokenCheck.Invalid:
                // The form fetches a new token and resubmits once when it sees this key.
                throw new ValidationException("formToken", "This form has expired. Reload the page and submit again.");
            case FormTokenCheck.TooFast:
                throw new ValidationException("form", "That was very quick. Please check your answers, then submit again.");
        }
    }

    // Every chosen region must belong to this project. Returns their names, in form order, for the email.
    private async Task<List<string>> CheckRegionsAsync(int projectId, List<int> regionIds, ValidationErrors errors, CancellationToken ct)
    {
        if (regionIds.Count == 0)
        {
            return [];
        }

        var names = await db.StreetTeamRegions
            .AsNoTracking()
            .Where(r => r.ProjectId == projectId && regionIds.Contains(r.Id))
            .OrderBy(r => r.SortOrder).ThenBy(r => r.Name)
            .Select(r => r.Name)
            .ToListAsync(ct);

        if (names.Count != regionIds.Count)
        {
            errors.Add("streetTeamRegionIds", "One or more regions aren't available. Reload the page and choose again.");
        }
        return names;
    }

    // Every chosen language must be one the form offers.
    private async Task CheckLanguagesAsync(List<int> languageIds, ValidationErrors errors, CancellationToken ct)
    {
        if (languageIds.Count == 0)
        {
            return;
        }

        var found = await db.SpokenLanguages.CountAsync(l => l.IsActive && languageIds.Contains(l.Id), ct);
        if (found != languageIds.Count)
        {
            errors.Add("spokenLanguageIds", "One or more languages aren't available. Reload the page and choose again.");
        }
    }

    private Registration BuildRegistration(
        SubmitApplicationRequest r, int projectId, DateTime now, List<int> regionIds, List<int> languageIds)
    {
        var p = r.Participation;
        var registration = new Registration
        {
            ReferenceNumber = "",   // set when saving
            ProjectId = projectId,
            FirstName = r.FirstName.Trim(),
            LastName = r.LastName.Trim(),
            DateOfBirth = r.IsUnder18 ? r.DateOfBirth : null,
            AddressLine = r.AddressLine.Trim(),
            City = r.City.Trim(),
            State = r.State.Trim(),
            ZipCode = r.ZipCode.Trim(),
            Phone = r.Phone.Trim(),
            Email = r.Email.Trim(),
            AffiliationName = Clean(r.AffiliationName),
            AffiliationAddressLine = Clean(r.AffiliationAddressLine),
            AffiliationCity = Clean(r.AffiliationCity),
            AffiliationState = Clean(r.AffiliationState),
            AffiliationZipCode = Clean(r.AffiliationZipCode),
            AffiliationPhone = Clean(r.AffiliationPhone),
            AffiliationPhoneExt = Clean(r.AffiliationPhoneExt),
            AffiliationEmail = Clean(r.AffiliationEmail),
            AgreementsAcceptedAt = now,
            AgreementsVersion = phcOptions.Value.AgreementsVersion,
            SubmittedAt = now,
            CreatedBy = CreatedBy,

            // Shifts and answers are kept only when their activity is chosen.
            Participation = new Registration_Participation
            {
                PitSurvey = p.PitSurvey,
                StreetTeam = p.StreetTeam,
                EventAssist = p.EventAssist,
                ReportLocations = p.ReportLocations,
                ShareFlyer = p.ShareFlyer,
                Donate = p.Donate,
                ResourceTable = p.ResourceTable,
                DistributionInfo = p.DistributionInfo,
                DirectService = p.DirectService,
                ShiftMorning = p.EventAssist && p.ShiftMorning,
                ShiftMidday = p.EventAssist && p.ShiftMidday,
                DonationDetails = p.Donate ? Clean(p.DonationDetails) : null,
                ResourceTableSummary = p.ResourceTable ? Clean(p.ResourceTableSummary) : null,
                DirectServiceDetails = p.DirectService ? Clean(p.DirectServiceDetails) : null,
            },
        };

        foreach (var regionId in regionIds)
        {
            registration.StreetTeamRegions.Add(new Registration_StreetTeamRegion { StreetTeamRegionId = regionId });
        }
        foreach (var languageId in languageIds)
        {
            registration.SpokenLanguages.Add(new Registration_SpokenLanguage { SpokenLanguageId = languageId });
        }
        return registration;
    }

    // Saves the application and its child rows in one transaction. If the random reference number
    // is already taken, the unique index refuses the insert and a new number is drawn.
    private async Task SaveWithNewReferenceAsync(Registration registration, CancellationToken ct)
    {
        db.Registrations.Add(registration);
        for (var attempt = 1; ; attempt++)
        {
            registration.ReferenceNumber = ReferenceNumbers.New();
            try
            {
                await db.SaveChangesAsync(ct);
                return;
            }
            catch (DbUpdateException ex) when (attempt < MaxReferenceAttempts && IsDuplicateReference(ex))
            {
                logger.LogWarning("Reference number {ReferenceNumber} was taken; drawing another.", registration.ReferenceNumber);
            }
        }
    }

    // 2601 and 2627 are SQL Server's duplicate-key errors; the index name says which key.
    private static bool IsDuplicateReference(DbUpdateException ex)
    {
        return ex.InnerException is SqlException sql
            && (sql.Number == 2601 || sql.Number == 2627)
            && sql.Message.Contains("IX_Registration_ReferenceNumber", StringComparison.Ordinal);
    }

    // Sends the email and records the outcome on the application. Never throws.
    private async Task<bool> SendConfirmationAsync(Registration registration, OpenProject project, List<string> regionNames)
    {
        DateTime? sentAt = null;
        string? error = null;
        try
        {
            var text = ConfirmationEmail.Build(registration, project.Name, project.EventDate, regionNames);
            await email.SendAsync(registration.Email, text.Subject, text.Body, CancellationToken.None);
            sentAt = DateTime.UtcNow;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Confirmation email for application {RegistrationId} failed.", registration.Id);
            error = Truncate($"{ex.GetType().Name}: {ex.Message}", MaxEmailErrorLength);
        }

        try
        {
            await db.Registrations
                .Where(r => r.Id == registration.Id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(r => r.ConfirmationEmailSentAt, sentAt)
                    .SetProperty(r => r.ConfirmationEmailError, error),
                    CancellationToken.None);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Couldn't record the confirmation email outcome for application {RegistrationId}.", registration.Id);
        }

        return sentAt is not null;
    }

    // Blank optional text is stored as NULL, not as an empty string.
    private static string? Clean(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }
        return value.Trim();
    }

    private static string Truncate(string value, int maxLength)
    {
        if (value.Length <= maxLength)
        {
            return value;
        }
        return value[..maxLength];
    }
}
