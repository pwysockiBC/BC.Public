// Which project is taking applications: the one whose window contains the given moment.
// If windows overlap, the earliest event wins. Shared by the form and the submission, so both
// always agree on what "open" means.

using BC.Public.Phc.Data;
using BC.Public.Phc.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BC.Public.Phc.Features.Form;

public static class OpenProjects
{
    public static IQueryable<Project> Query(PhcDbContext db, DateTime utcNow)
    {
        return db.Projects
            .AsNoTracking()
            .Where(p => p.RegistrationOpensAt <= utcNow && p.RegistrationClosesAt > utcNow)
            .OrderBy(p => p.EventDate).ThenBy(p => p.Id);
    }
}
