// Which locations make up each region. A link table; read only.

namespace BC.Public.Phc.Data.Entities;

public class StreetTeamRegion_StreetTeamLocation
{
    public int StreetTeamRegionId { get; set; }
    public StreetTeamRegion StreetTeamRegion { get; set; } = null!;

    public int StreetTeamLocationId { get; set; }
    public StreetTeamLocation StreetTeamLocation { get; set; } = null!;
}
