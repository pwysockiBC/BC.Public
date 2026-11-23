// Maps the street-team tables (regions, locations, and the link between them) for reading.

using BC.Public.Phc.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BC.Public.Phc.Data.Configurations;

public class StreetTeamRegionConfiguration : IEntityTypeConfiguration<StreetTeamRegion>
{
    public void Configure(EntityTypeBuilder<StreetTeamRegion> e)
    {
        e.ToTable("StreetTeamRegion");
    }
}

public class StreetTeamLocationConfiguration : IEntityTypeConfiguration<StreetTeamLocation>
{
    public void Configure(EntityTypeBuilder<StreetTeamLocation> e)
    {
        e.ToTable("StreetTeamLocation");
    }
}

public class StreetTeamRegion_StreetTeamLocationConfiguration
    : IEntityTypeConfiguration<StreetTeamRegion_StreetTeamLocation>
{
    public void Configure(EntityTypeBuilder<StreetTeamRegion_StreetTeamLocation> e)
    {
        e.ToTable("StreetTeamRegion_StreetTeamLocation");
        e.HasKey(x => new { x.StreetTeamRegionId, x.StreetTeamLocationId });
        e.HasOne(x => x.StreetTeamRegion).WithMany(r => r.Locations).HasForeignKey(x => x.StreetTeamRegionId);
        e.HasOne(x => x.StreetTeamLocation).WithMany().HasForeignKey(x => x.StreetTeamLocationId);
    }
}
