// What an applicant is willing to do: one yes/no column per activity and shift, plus the answers
// the activities ask for. Always written, one row per application.

namespace BC.Public.Phc.Data.Entities;

public class Registration_Participation
{
    // Also the primary key: one row per application.
    public int RegistrationId { get; set; }
    public Registration Registration { get; set; } = null!;

    // Activities
    public bool PitSurvey { get; set; }
    public bool StreetTeam { get; set; }
    public bool EventAssist { get; set; }
    public bool ReportLocations { get; set; }
    public bool ShareFlyer { get; set; }
    public bool Donate { get; set; }
    public bool ResourceTable { get; set; }
    public bool DistributionInfo { get; set; }
    public bool DirectService { get; set; }

    // Event-assistance shifts; only set when EventAssist is
    public bool ShiftMorning { get; set; }
    public bool ShiftMidday { get; set; }

    // Answers, required when their activity is chosen
    public string? DonationDetails { get; set; }
    public string? ResourceTableSummary { get; set; }
    public string? DirectServiceDetails { get; set; }
}
