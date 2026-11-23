// Date mapping for BC_Phc, which MS Access also reads: every date column is SQL "datetime".
// A copy of the internal Lib's AccessCompatibleConventions; the public app doesn't reference
// internal code, so keep the two in step if either changes.

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace BC.Public.Phc.Data;

public static class AccessCompatibleConventions
{
    public static ModelConfigurationBuilder UseAccessCompatibleTypes(this ModelConfigurationBuilder b)
    {
        // Moments in time: stored as UTC datetime, read back marked as UTC.
        b.Properties<DateTime>()
            .HaveColumnType("datetime")
            .HaveConversion<UtcDateTimeConverter>();

        // Calendar dates: stored as datetime at midnight, read back as a date.
        b.Properties<DateOnly>()
            .HaveColumnType("datetime")
            .HaveConversion<DateOnlyToDateTimeConverter>();

        // These also cover DateTime? and DateOnly? properties.
        return b;
    }
}

// SQL datetime has no time zone; every stored DateTime is UTC, so it's marked that way when read,
// and JSON sends it with a "Z".
public sealed class UtcDateTimeConverter() : ValueConverter<DateTime, DateTime>(
    v => v,
    v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

// A calendar date is stored as midnight on that day, and the time is dropped when read back.
public sealed class DateOnlyToDateTimeConverter() : ValueConverter<DateOnly, DateTime>(
    d => d.ToDateTime(TimeOnly.MinValue),
    dt => DateOnly.FromDateTime(dt));
