// The form token: a signed, time-limited value holding the moment the form was loaded.
// It shows a submission came from a form this API served, and lets us refuse submissions
// made faster than a person could fill the form in.

using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Options;
using System.Globalization;
using System.Security.Cryptography;

namespace BC.Public.Phc.Shared.Spam;

public enum FormTokenCheck
{
    Valid,
    Invalid,      // missing, altered, or older than the lifetime
    TooFast,      // genuine, but submitted sooner than MinimumFillSeconds
}

public sealed class FormTokens(IDataProtectionProvider provider, IOptions<SpamOptions> options)
{
    // The purpose string ties tokens to this use; a value protected for anything else won't unprotect.
    private readonly ITimeLimitedDataProtector protector =
        provider.CreateProtector("BC.Public.Phc.FormToken").ToTimeLimitedDataProtector();

    public string Issue()
    {
        var issuedAt = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString(CultureInfo.InvariantCulture);
        var lifetime = TimeSpan.FromHours(options.Value.FormTokenLifetimeHours);
        return protector.Protect(issuedAt, lifetime);
    }

    public FormTokenCheck Check(string? token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return FormTokenCheck.Invalid;
        }

        string payload;
        try
        {
            // Throws if the token was altered, made with other keys, or has expired.
            payload = protector.Unprotect(token, out _);
        }
        catch (CryptographicException)
        {
            return FormTokenCheck.Invalid;
        }

        if (!long.TryParse(payload, NumberStyles.None, CultureInfo.InvariantCulture, out var issuedAtMs))
        {
            return FormTokenCheck.Invalid;
        }

        var elapsed = DateTimeOffset.UtcNow - DateTimeOffset.FromUnixTimeMilliseconds(issuedAtMs);
        if (elapsed < TimeSpan.FromSeconds(options.Value.MinimumFillSeconds))
        {
            return FormTokenCheck.TooFast;
        }
        return FormTokenCheck.Valid;
    }
}
