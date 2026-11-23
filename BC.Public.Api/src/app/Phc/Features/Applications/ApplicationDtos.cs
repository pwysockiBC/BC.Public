// What POST /applications accepts and returns. Lengths match the BC_Phc columns; the rules
// that need more than one field live in ApplicationRules. See the intake contract.

using System.ComponentModel.DataAnnotations;

namespace BC.Public.Phc.Features.Applications;

public sealed class SubmitApplicationRequest
{
    // The open project, from GET /form.
    public int ProjectId { get; init; }

    // From GET /form, sent back unchanged.
    public string? FormToken { get; init; }

    // Hidden field on the form; people never see it, so anything in it came from a bot.
    public string? Homepage { get; init; }

    // The person
    [Required, MaxLength(100)] public string FirstName { get; init; } = "";
    [Required, MaxLength(100)] public string LastName { get; init; } = "";

    // Date of birth is asked for, and kept, only when this is ticked.
    public bool IsUnder18 { get; init; }
    public DateOnly? DateOfBirth { get; init; }

    [Required, MaxLength(200)] public string AddressLine { get; init; } = "";
    [Required, MaxLength(100)] public string City { get; init; } = "";
    [Required, MaxLength(50)] public string State { get; init; } = "";
    [Required, MaxLength(10)] public string ZipCode { get; init; } = "";
    [Required, MaxLength(30)] public string Phone { get; init; } = "";
    [Required, MaxLength(256)] public string Email { get; init; } = "";

    // Their organization (optional)
    [MaxLength(200)] public string? AffiliationName { get; init; }
    [MaxLength(200)] public string? AffiliationAddressLine { get; init; }
    [MaxLength(100)] public string? AffiliationCity { get; init; }
    [MaxLength(50)] public string? AffiliationState { get; init; }
    [MaxLength(10)] public string? AffiliationZipCode { get; init; }
    [MaxLength(30)] public string? AffiliationPhone { get; init; }
    [MaxLength(10)] public string? AffiliationPhoneExt { get; init; }
    [MaxLength(256)] public string? AffiliationEmail { get; init; }

    // What they're willing to do
    [Required] public ParticipationRequest Participation { get; init; } = new();
    [MaxLength(50)] public List<int> StreetTeamRegionIds { get; init; } = [];
    [MaxLength(50)] public List<int> SpokenLanguageIds { get; init; } = [];

    // The agreements shown on the form, and which version of their wording
    public bool AgreementsAccepted { get; init; }
    [Required, MaxLength(20)] public string AgreementsVersion { get; init; } = "";
}

// One yes/no per activity and shift, plus the answers some activities ask for.
// The same columns as Registration_Participation.
public sealed class ParticipationRequest
{
    public bool PitSurvey { get; init; }
    public bool StreetTeam { get; init; }
    public bool EventAssist { get; init; }
    public bool ReportLocations { get; init; }
    public bool ShareFlyer { get; init; }
    public bool Donate { get; init; }
    public bool ResourceTable { get; init; }
    public bool DistributionInfo { get; init; }
    public bool DirectService { get; init; }

    public bool ShiftMorning { get; init; }
    public bool ShiftMidday { get; init; }

    [MaxLength(2000)] public string? DonationDetails { get; init; }
    [MaxLength(2000)] public string? ResourceTableSummary { get; init; }
    [MaxLength(2000)] public string? DirectServiceDetails { get; init; }
}

public sealed class SubmitApplicationResult
{
    // Shown to the person as their confirmation.
    public required string ReferenceNumber { get; init; }

    // False when the email couldn't be sent; the page then tells them to keep the reference.
    public required bool ConfirmationEmailSent { get; init; }
}
