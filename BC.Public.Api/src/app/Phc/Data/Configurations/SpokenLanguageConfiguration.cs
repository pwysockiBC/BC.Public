// Maps SpokenLanguage to its table for reading.

using BC.Public.Phc.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BC.Public.Phc.Data.Configurations;

public class SpokenLanguageConfiguration : IEntityTypeConfiguration<SpokenLanguage>
{
    public void Configure(EntityTypeBuilder<SpokenLanguage> e)
    {
        e.ToTable("SpokenLanguage");
    }
}
