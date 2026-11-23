// A PHC season, as the public form sees it: its name, event date and when applications are open.
// Maps only the columns this app reads; the table is owned by the internal PHC API.

namespace BC.Public.Phc.Data.Entities;

public class Project
{
    public int Id { get; set; }
    public required string Name { get; set; }

    // The day of the event. A calendar date, stored as midnight.
    public DateOnly EventDate { get; set; }

    // The form accepts applications only between these two moments (UTC).
    public DateTime RegistrationOpensAt { get; set; }
    public DateTime RegistrationClosesAt { get; set; }
}
