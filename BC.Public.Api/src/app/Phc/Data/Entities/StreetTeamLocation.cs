// A town or place the street team can survey, shown under its regions on the form. Read only.

namespace BC.Public.Phc.Data.Entities;

public class StreetTeamLocation
{
    public int Id { get; set; }
    public required string Name { get; set; }

    // Retired locations aren't shown.
    public bool IsActive { get; set; }
}
