// Settings for the spam checks and rate limits, from the "Spam" configuration section.

namespace BC.Public.Phc.Shared.Spam;

public sealed class SpamOptions
{
    public const string Section = "Spam";

    // A submission this soon after the form loaded is treated as a bot.
    public int MinimumFillSeconds { get; set; } = 3;

    // How long a loaded form stays submittable.
    public int FormTokenLifetimeHours { get; set; } = 24;

    // Submissions allowed per client address in each window.
    public int SubmitPermitLimit { get; set; } = 10;
    public int SubmitWindowMinutes { get; set; } = 10;

    // Form loads allowed per client address per minute.
    public int FormPermitPerMinute { get; set; } = 60;
}
