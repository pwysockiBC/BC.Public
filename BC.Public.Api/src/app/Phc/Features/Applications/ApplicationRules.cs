// The intake contract's field rules that need more than a length check, for one application.
// Pure: no database, no clock (the caller passes today's date), so it can be unit tested.
// The participation rules are the same ones the internal API's staff edit enforces.

using BC.Public.Phc.Shared.Errors;
using System.Net.Mail;
using System.Text.RegularExpressions;

namespace BC.Public.Phc.Features.Applications;

public static partial class ApplicationRules
{
    [GeneratedRegex(@"^\d{5}(-\d{4})?$")]
    private static partial Regex ZipCodePattern();

    public static void Check(
        SubmitApplicationRequest r, DateOnly eventDate, DateOnly today, string currentAgreementsVersion,
        ValidationErrors errors)
    {
        CheckPerson(r, eventDate, today, errors);
        CheckAffiliation(r, errors);
        CheckParticipation(r, errors);
        CheckAgreements(r, currentAgreementsVersion, errors);
    }

    private static void CheckPerson(SubmitApplicationRequest r, DateOnly eventDate, DateOnly today, ValidationErrors errors)
    {
        if (r.IsUnder18)
        {
            if (r.DateOfBirth is null)
            {
                errors.Add("dateOfBirth", "Enter your date of birth.");
            }
            else if (r.DateOfBirth.Value > today)
            {
                errors.Add("dateOfBirth", "Date of birth can't be in the future.");
            }
            else if (!IsUnder18On(r.DateOfBirth.Value, eventDate))
            {
                errors.Add("dateOfBirth", "This date makes you 18 or older on the day of the event. Untick \"I'm under 18\" if that's right.");
            }
        }

        if (!IsZipCode(r.ZipCode))
        {
            errors.Add("zipCode", "Enter a 5-digit ZIP code, such as 07601.");
        }
        if (CountDigits(r.Phone) < 10)
        {
            errors.Add("phone", "Enter a phone number with area code.");
        }
        if (!IsEmail(r.Email))
        {
            errors.Add("email", "Enter a valid email address, such as name@example.com.");
        }
    }

    // The organization section is optional, but once anything is filled in it needs a name.
    private static void CheckAffiliation(SubmitApplicationRequest r, ValidationErrors errors)
    {
        string?[] fields =
        [
            r.AffiliationName, r.AffiliationAddressLine, r.AffiliationCity, r.AffiliationState,
            r.AffiliationZipCode, r.AffiliationPhone, r.AffiliationPhoneExt, r.AffiliationEmail,
        ];

        var anyFilled = false;
        foreach (var field in fields)
        {
            if (!string.IsNullOrWhiteSpace(field))
            {
                anyFilled = true;
            }
        }

        if (anyFilled && string.IsNullOrWhiteSpace(r.AffiliationName))
        {
            errors.Add("affiliationName", "Enter the organization's name, or clear the organization fields.");
        }
        if (!string.IsNullOrWhiteSpace(r.AffiliationZipCode) && !IsZipCode(r.AffiliationZipCode))
        {
            errors.Add("affiliationZipCode", "Enter a 5-digit ZIP code, such as 07601.");
        }
        if (!string.IsNullOrWhiteSpace(r.AffiliationEmail) && !IsEmail(r.AffiliationEmail))
        {
            errors.Add("affiliationEmail", "Enter a valid email address, such as name@example.com.");
        }
    }

    private static void CheckParticipation(SubmitApplicationRequest r, ValidationErrors errors)
    {
        var p = r.Participation;

        if (CountActivities(p) == 0)
        {
            errors.Add("participation", "Choose at least one way to participate.");
        }
        if (p.Donate && string.IsNullOrWhiteSpace(p.DonationDetails))
        {
            errors.Add("participation.donationDetails", "Describe what you'd like to donate.");
        }
        if (p.ResourceTable && string.IsNullOrWhiteSpace(p.ResourceTableSummary))
        {
            errors.Add("participation.resourceTableSummary", "Summarize the services you'd offer.");
        }
        if (p.DirectService && string.IsNullOrWhiteSpace(p.DirectServiceDetails))
        {
            errors.Add("participation.directServiceDetails", "Tell us which service you'd offer.");
        }
        if (p.EventAssist && !p.ShiftMorning && !p.ShiftMidday)
        {
            errors.Add("participation.shifts", "Choose at least one shift for event assistance.");
        }
        if (p.StreetTeam && r.StreetTeamRegionIds.Count == 0)
        {
            errors.Add("streetTeamRegionIds", "Choose at least one region for the street team.");
        }
    }

    private static void CheckAgreements(SubmitApplicationRequest r, string currentAgreementsVersion, ValidationErrors errors)
    {
        if (!r.AgreementsAccepted)
        {
            errors.Add("agreementsAccepted", "Read and accept the agreements to apply.");
        }
        if (!string.Equals(r.AgreementsVersion.Trim(), currentAgreementsVersion, StringComparison.Ordinal))
        {
            errors.Add("agreementsVersion", "The agreements have been updated. Reload the page to read the current wording, then submit again.");
        }
    }

    public static bool IsUnder18On(DateOnly dateOfBirth, DateOnly day)
    {
        return dateOfBirth.AddYears(18) > day;
    }

    public static bool IsZipCode(string value)
    {
        return ZipCodePattern().IsMatch(value.Trim());
    }

    // A plain address only (no display name), with a dot in the domain.
    public static bool IsEmail(string value)
    {
        var trimmed = value.Trim();
        if (!MailAddress.TryCreate(trimmed, out var address))
        {
            return false;
        }
        return address.Address == trimmed && address.Host.Contains('.');
    }

    private static int CountDigits(string value)
    {
        var count = 0;
        foreach (var c in value)
        {
            if (char.IsAsciiDigit(c))
            {
                count++;
            }
        }
        return count;
    }

    private static int CountActivities(ParticipationRequest p)
    {
        bool[] activities =
        [
            p.PitSurvey, p.StreetTeam, p.EventAssist, p.ReportLocations, p.ShareFlyer,
            p.Donate, p.ResourceTable, p.DistributionInfo, p.DirectService,
        ];

        var count = 0;
        foreach (var chosen in activities)
        {
            if (chosen)
            {
                count++;
            }
        }
        return count;
    }
}
