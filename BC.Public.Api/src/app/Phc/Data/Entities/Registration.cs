// One application, as this app writes it. Maps only the columns the intake contract lets the
// public app write; staff columns (StaffNotes, UpdatedAt, RowVersion, ...) are left to the
// database's defaults and the internal app.

namespace BC.Public.Phc.Data.Entities;

public class Registration
{
    public int Id { get; set; }
    public required string ReferenceNumber { get; set; }
    public int ProjectId { get; set; }

    // The person
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public DateOnly? DateOfBirth { get; set; }           // only for applicants under 18
    public required string AddressLine { get; set; }
    public required string City { get; set; }
    public required string State { get; set; }
    public required string ZipCode { get; set; }
    public required string Phone { get; set; }
    public required string Email { get; set; }

    // Their organization, as entered (optional)
    public string? AffiliationName { get; set; }
    public string? AffiliationAddressLine { get; set; }
    public string? AffiliationCity { get; set; }
    public string? AffiliationState { get; set; }
    public string? AffiliationZipCode { get; set; }
    public string? AffiliationPhone { get; set; }
    public string? AffiliationPhoneExt { get; set; }
    public string? AffiliationEmail { get; set; }

    // When the agreements were accepted (server clock, UTC) and which wording was shown.
    public DateTime AgreementsAcceptedAt { get; set; }
    public required string AgreementsVersion { get; set; }

    public DateTime SubmittedAt { get; set; }            // UTC

    // Who created the row. CreatedAt comes from the database default.
    public required string CreatedBy { get; set; }

    // The confirmation email's outcome, written after the application is saved.
    public DateTime? ConfirmationEmailSentAt { get; set; }
    public string? ConfirmationEmailError { get; set; }

    public Registration_Participation? Participation { get; set; }
    public List<Registration_StreetTeamRegion> StreetTeamRegions { get; } = [];
    public List<Registration_SpokenLanguage> SpokenLanguages { get; } = [];
}
