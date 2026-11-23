// Builds what the form needs: the project open right now, its regions with their locations,
// the active languages, and a fresh form token.

using BC.Public.Phc.Data;
using BC.Public.Phc.Shared.Spam;
using Microsoft.EntityFrameworkCore;

namespace BC.Public.Phc.Features.Form;

public class FormService(PhcDbContext db, FormTokens tokens)
{
    public async Task<FormResponse> GetAsync(CancellationToken ct)
    {
        var now = DateTime.UtcNow;
        var project = await OpenProjects.Query(db, now)
            .Select(p => new FormProject
            {
                Id = p.Id,
                Name = p.Name,
                EventDate = p.EventDate,
                RegistrationClosesAt = p.RegistrationClosesAt,
            })
            .FirstOrDefaultAsync(ct);

        if (project is null)
        {
            return await ClosedAsync(now, ct);
        }

        var regions = await db.StreetTeamRegions
            .AsNoTracking()
            .Where(r => r.ProjectId == project.Id)
            .OrderBy(r => r.SortOrder).ThenBy(r => r.Name)
            .Select(r => new FormRegion
            {
                Id = r.Id,
                Name = r.Name,
                Locations = r.Locations
                    .Where(x => x.StreetTeamLocation.IsActive)
                    .OrderBy(x => x.StreetTeamLocation.Name)
                    .Select(x => x.StreetTeamLocation.Name)
                    .ToList(),
            })
            .ToListAsync(ct);

        var languages = await db.SpokenLanguages
            .AsNoTracking()
            .Where(l => l.IsActive)
            .OrderBy(l => l.SortOrder).ThenBy(l => l.Name)
            .Select(l => new FormOption { Id = l.Id, Name = l.Name })
            .ToListAsync(ct);

        return new FormResponse
        {
            IsOpen = true,
            Project = project,
            NextOpensAt = null,
            StreetTeamRegions = regions,
            SpokenLanguages = languages,
            FormToken = tokens.Issue(),
        };
    }

    private async Task<FormResponse> ClosedAsync(DateTime now, CancellationToken ct)
    {
        var nextOpensAt = await db.Projects
            .AsNoTracking()
            .Where(p => p.RegistrationOpensAt > now)
            .OrderBy(p => p.RegistrationOpensAt)
            .Select(p => (DateTime?)p.RegistrationOpensAt)
            .FirstOrDefaultAsync(ct);

        return new FormResponse
        {
            IsOpen = false,
            Project = null,
            NextOpensAt = nextOpensAt,
            StreetTeamRegions = [],
            SpokenLanguages = [],
            FormToken = null,
        };
    }
}
