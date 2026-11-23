// Per-client rate limits: one policy for loading the form, a stricter one for submitting.
// Clients are told apart by IP address. Behind a reverse proxy, forwarded headers must be set up
// (a deployment item), or every visitor shares the proxy's address and its limit.

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Globalization;
using System.Threading.RateLimiting;

namespace BC.Public.Phc.Shared.Spam;

public static class RateLimits
{
    // Policy names, used by [EnableRateLimiting] on the controllers.
    public const string Form = "form";
    public const string Submit = "submit";

    public static IServiceCollection AddPublicRateLimits(this IServiceCollection services, SpamOptions spam)
    {
        var formWindow = TimeSpan.FromMinutes(1);
        var submitWindow = TimeSpan.FromMinutes(spam.SubmitWindowMinutes);

        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.OnRejected = WriteRejectionAsync;
            options.AddPolicy(Form, http => PerClient(http, spam.FormPermitPerMinute, formWindow));
            options.AddPolicy(Submit, http => PerClient(http, spam.SubmitPermitLimit, submitWindow));
        });
        return services;
    }

    // A fixed window per IP address. Requests over the limit are refused, never queued.
    private static RateLimitPartition<string> PerClient(HttpContext http, int permitLimit, TimeSpan window)
    {
        var client = http.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        return RateLimitPartition.GetFixedWindowLimiter(client, _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = permitLimit,
            Window = window,
            QueueLimit = 0,
        });
    }

    // 429 with Retry-After and a problem-details body the form can show.
    private static async ValueTask WriteRejectionAsync(OnRejectedContext context, CancellationToken ct)
    {
        var http = context.HttpContext;
        if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
        {
            var seconds = (int)Math.Ceiling(retryAfter.TotalSeconds);
            http.Response.Headers.RetryAfter = seconds.ToString(CultureInfo.InvariantCulture);
        }

        var problems = http.RequestServices.GetRequiredService<IProblemDetailsService>();
        await problems.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = http,
            ProblemDetails = new ProblemDetails
            {
                Status = StatusCodes.Status429TooManyRequests,
                Title = "Too many requests. Please wait a few minutes, then try again.",
            },
        });
    }
}
