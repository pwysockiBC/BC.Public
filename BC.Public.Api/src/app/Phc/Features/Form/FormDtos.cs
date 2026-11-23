// What GET /form returns: whether applications are open, the open project, the choices the
// form offers, and a form token to send back with the application.

namespace BC.Public.Phc.Features.Form;

public sealed class FormResponse
{
    public required bool IsOpen { get; init; }

    // Null when nothing is open.
    public required FormProject? Project { get; init; }

    // When nothing is open: when the next window opens, if one is set up.
    public required DateTime? NextOpensAt { get; init; }

    // Empty when nothing is open.
    public required List<FormRegion> StreetTeamRegions { get; init; }
    public required List<FormOption> SpokenLanguages { get; init; }

    // Send back unchanged in the application. Null when nothing is open.
    public required string? FormToken { get; init; }
}

public sealed class FormProject
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required DateOnly EventDate { get; init; }
    public required DateTime RegistrationClosesAt { get; init; }
}

public sealed class FormRegion
{
    public required int Id { get; init; }
    public required string Name { get; init; }

    // The towns and places in this region, so people know what they're choosing.
    public required List<string> Locations { get; init; }
}

public sealed class FormOption
{
    public required int Id { get; init; }
    public required string Name { get; init; }
}
