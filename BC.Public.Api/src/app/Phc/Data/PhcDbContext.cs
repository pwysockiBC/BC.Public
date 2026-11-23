// The public app's view of BC_Phc: reads projects, regions and languages; inserts applications.
// No migrations: the internal PHC API owns the schema. Only the tables and columns in the
// intake contract are mapped, and the public SQL login can't touch anything else.

using BC.Public.Phc.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BC.Public.Phc.Data;

public class PhcDbContext(DbContextOptions<PhcDbContext> options) : DbContext(options)
{
    // EF Core fills these in when the context is created.

    // Read for the form
    public DbSet<Project> Projects { get; set; } = null!;
    public DbSet<StreetTeamRegion> StreetTeamRegions { get; set; } = null!;
    public DbSet<SpokenLanguage> SpokenLanguages { get; set; } = null!;

    // Written by a submission (child rows are reached through Registration)
    public DbSet<Registration> Registrations { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PhcDbContext).Assembly);
    }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.UseAccessCompatibleTypes();
    }
}
