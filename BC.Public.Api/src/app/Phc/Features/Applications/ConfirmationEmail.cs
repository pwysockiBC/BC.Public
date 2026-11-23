// The "we received your application" email: a fixed plain-text template.
// Nothing the applicant typed goes in the subject. Wording to be approved by program staff.

using BC.Public.Phc.Data.Entities;
using System.Globalization;
using System.Text;

namespace BC.Public.Phc.Features.Applications;

public sealed record ConfirmationEmailText(string Subject, string Body);

public static class ConfirmationEmail
{
    private static readonly CultureInfo English = CultureInfo.GetCultureInfo("en-US");

    public static ConfirmationEmailText Build(
        Registration registration, string projectName, DateOnly eventDate, List<string> regionNames)
    {
        var subject = $"We received your application for {projectName}";

        var body = new StringBuilder();
        body.AppendLine($"Hello {registration.FirstName},");
        body.AppendLine();
        body.AppendLine($"Thank you for applying to take part in {projectName} on {eventDate.ToString("dddd, MMMM d, yyyy", English)}.");
        body.AppendLine();
        body.AppendLine($"Your reference number is {registration.ReferenceNumber}.");
        body.AppendLine("Please keep it, and quote it if you contact us about your application.");
        body.AppendLine();
        body.AppendLine("You told us you're willing to help with:");

        var p = registration.Participation!;
        foreach (var activity in Activities.All)
        {
            if (Activities.IsTicked(p, activity.Key))
            {
                body.AppendLine($"  - {activity.Label}{DetailFor(activity.Key, p, regionNames)}");
            }
        }

        body.AppendLine();
        body.AppendLine("We'll be in touch with next steps before the event.");
        body.AppendLine();
        body.AppendLine("Bergen County Project Homeless Connect");
        body.AppendLine();
        body.AppendLine("This is an automated message.");

        return new ConfirmationEmailText(subject, body.ToString());
    }

    // Extra detail after an activity's name, e.g. " (regions: North, South)".
    private static string DetailFor(string key, Registration_Participation p, List<string> regionNames)
    {
        if (key == "StreetTeam" && regionNames.Count > 0)
        {
            return $" (regions: {string.Join(", ", regionNames)})";
        }
        if (key == "EventAssist")
        {
            var shifts = Activities.TickedShiftLabels(p);
            if (shifts.Count > 0)
            {
                return $" (shifts: {string.Join(", ", shifts)})";
            }
        }
        return "";
    }
}
