// Maps an application and its child rows (participation, regions, languages) for inserting.
// Lengths aren't repeated here: the request DTOs enforce them, and the database owns the schema.

using BC.Public.Phc.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BC.Public.Phc.Data.Configurations;

public class RegistrationConfiguration : IEntityTypeConfiguration<Registration>
{
    public void Configure(EntityTypeBuilder<Registration> e)
    {
        e.ToTable("Registration");

        // Saved together with the application, in one transaction.
        e.HasOne(x => x.Participation)
            .WithOne(p => p.Registration)
            .HasForeignKey<Registration_Participation>(p => p.RegistrationId);
        e.HasMany(x => x.StreetTeamRegions).WithOne().HasForeignKey(x => x.RegistrationId);
        e.HasMany(x => x.SpokenLanguages).WithOne().HasForeignKey(x => x.RegistrationId);
    }
}

public class Registration_ParticipationConfiguration : IEntityTypeConfiguration<Registration_Participation>
{
    public void Configure(EntityTypeBuilder<Registration_Participation> e)
    {
        e.ToTable("Registration_Participation");
        e.HasKey(x => x.RegistrationId);
    }
}

public class Registration_StreetTeamRegionConfiguration : IEntityTypeConfiguration<Registration_StreetTeamRegion>
{
    public void Configure(EntityTypeBuilder<Registration_StreetTeamRegion> e)
    {
        e.ToTable("Registration_StreetTeamRegion");
        e.HasKey(x => new { x.RegistrationId, x.StreetTeamRegionId });
    }
}

public class Registration_SpokenLanguageConfiguration : IEntityTypeConfiguration<Registration_SpokenLanguage>
{
    public void Configure(EntityTypeBuilder<Registration_SpokenLanguage> e)
    {
        e.ToTable("Registration_SpokenLanguage");
        e.HasKey(x => new { x.RegistrationId, x.SpokenLanguageId });
    }
}
