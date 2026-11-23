// Sends one plain-text email through the SMTP relay (or to a pickup folder in development).
// Throws on failure; callers decide what a failure means.
// System.Net.Mail is enough for an internal relay with no TLS or sign-in; MailKit would be the
// replacement if that ever changes.

using Microsoft.Extensions.Options;
using System.Net.Mail;

namespace BC.Public.Phc.Shared.Email;

public sealed class EmailSender(IOptions<EmailOptions> options)
{
    public async Task SendAsync(string to, string subject, string body, CancellationToken ct)
    {
        var o = options.Value;

        using var message = new MailMessage
        {
            From = new MailAddress(o.FromAddress, o.FromName),
            Subject = subject,
            Body = body,
            IsBodyHtml = false,
        };
        message.To.Add(new MailAddress(to));
        if (!string.IsNullOrWhiteSpace(o.ReplyTo))
        {
            message.ReplyToList.Add(new MailAddress(o.ReplyTo));
        }

        using var client = new SmtpClient();
        if (!string.IsNullOrWhiteSpace(o.PickupDirectory))
        {
            var folder = Path.GetFullPath(o.PickupDirectory);
            Directory.CreateDirectory(folder);
            client.DeliveryMethod = SmtpDeliveryMethod.SpecifiedPickupDirectory;
            client.PickupDirectoryLocation = folder;
        }
        else
        {
            client.Host = o.Host;
            client.Port = o.Port;
            client.EnableSsl = o.EnableSsl;
            client.UseDefaultCredentials = false;
        }

        // SmtpClient.Timeout only applies to the synchronous Send, so the async send is
        // cancelled by a timer instead.
        using var timeout = CancellationTokenSource.CreateLinkedTokenSource(ct);
        timeout.CancelAfter(TimeSpan.FromSeconds(o.TimeoutSeconds));
        await client.SendMailAsync(message, timeout.Token);
    }
}
