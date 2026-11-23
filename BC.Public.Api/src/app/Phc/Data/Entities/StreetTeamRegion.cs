// A project's group of street-team locations, such as "North". Applicants on the street team
// choose the regions they're willing to survey. Read only.

namespace BC.Public.Phc.Data.Entities;

public class StreetTeamRegion
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public required string Name { get; set; }

    // Order on the form.
    public int SortOrder { get; set; }

    public List<StreetTeamRegion_StreetTeamLocation> Locations { get; } = [];
}
