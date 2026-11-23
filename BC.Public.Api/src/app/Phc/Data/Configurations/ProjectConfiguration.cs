// Maps Project to its table. The schema itself is defined by the internal PHC API's migrations.

using BC.Public.Phc.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BC.Public.Phc.Data.Configurations;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> e)
    {
        e.ToTable("Project");
    }
}
