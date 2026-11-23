// Settings for sending email through the SMTP relay, from the "Email" configuration section.
// Checked when the app starts, so a missing sender address stops it loudly instead of every
// confirmation email failing quietly.

using System.ComponentModel.DataAnnotations;

namespace BC.Public.Phc.Shared.Email;

public sealed class EmailOptions
{
    public const string Section = "Email";

    // The relay: 10.250.0.52, port 25, no TLS, no sign-in. It allows mail by sending server.
    public string Host { get; set; } = "";
    public int Port { get; set; } = 25;
    public bool EnableSsl { get; set; }

    [Required, EmailAddress]
    public string FromAddress { get; set; } = "";
    public string FromName { get; set; } = "";

    // Where replies go, if not the sender. Optional.
    public string? ReplyTo { get; set; }

    [Range(1, 120)]
    public int TimeoutSeconds { get; set; } = 15;

    // Development only: write .eml files to this folder instead of sending.
    public string? PickupDirectory { get; set; }
}
