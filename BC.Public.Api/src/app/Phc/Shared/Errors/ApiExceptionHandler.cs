// Turns expected exceptions into problem-details responses:
//   ValidationException      → 400 with the field errors
//   BadHttpRequestException  → its own status, e.g. 413 when the body is over the size limit
// Anything else falls through and becomes a generic 500 with no internal details (in Production).

using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BC.Public.Phc.Shared.Errors;

public sealed class ApiExceptionHandler(IProblemDetailsService problemDetails) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext http, Exception exception, CancellationToken ct)
    {
        ProblemDetails problem;
        switch (exception)
        {
            case ValidationException invalid:
                problem = new HttpValidationProblemDetails(invalid.Errors)
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Some answers need attention.",
                };
                break;

            // Kestrel and IIS both throw this for a malformed or oversized request.
            case BadHttpRequestException badRequest:
                problem = new ProblemDetails
                {
                    Status = badRequest.StatusCode,
                    Title = badRequest.StatusCode == StatusCodes.Status413PayloadTooLarge
                        ? "The application is too large to send."
                        : "The request couldn't be read.",
                };
                break;

            default:
                return false;
        }

        http.Response.StatusCode = problem.Status!.Value;
        return await problemDetails.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = http,
            Exception = exception,
            ProblemDetails = problem,
        });
    }
}
