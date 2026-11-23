// The activities and shifts, as named in the confirmation email. The same keys and labels as
// the internal API's Activities.cs; the form has its own, longer wording.

using BC.Public.Phc.Data.Entities;

namespace BC.Public.Phc.Features.Applications;

public sealed record Activity(string Key, string Label);

public static class Activities
{
    public static readonly Activity[] All =
    [
        new("PitSurvey", "PIT survey"),
        new("StreetTeam", "Street team"),
        new("EventAssist", "Event assistance"),
        new("ReportLocations", "Report locations"),
        new("ShareFlyer", "Share flyer"),
        new("Donate", "Donate"),
        new("ResourceTable", "Resource table"),
        new("DistributionInfo", "Distribution info"),
        new("DirectService", "Direct service"),
    ];

    public static readonly Activity[] Shifts =
    [
        new("Morning", "7:30–11:00 AM"),
        new("Midday", "10:30 AM–2:00 PM"),
    ];

    public static bool IsTicked(Registration_Participation p, string key)
    {
        return key switch
        {
            "PitSurvey" => p.PitSurvey,
            "StreetTeam" => p.StreetTeam,
            "EventAssist" => p.EventAssist,
            "ReportLocations" => p.ReportLocations,
            "ShareFlyer" => p.ShareFlyer,
            "Donate" => p.Donate,
            "ResourceTable" => p.ResourceTable,
            "DistributionInfo" => p.DistributionInfo,
            "DirectService" => p.DirectService,
            "Morning" => p.ShiftMorning,
            "Midday" => p.ShiftMidday,
            _ => false,
        };
    }

    public static List<string> TickedShiftLabels(Registration_Participation p)
    {
        var labels = new List<string>();
        foreach (var shift in Shifts)
        {
            if (IsTicked(p, shift.Key))
            {
                labels.Add(shift.Label);
            }
        }
        return labels;
    }
}
