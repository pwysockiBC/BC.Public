// POST /applications: submit one application from the public form.

using BC.Public.Phc.Shared.Spam;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BC.Public.Phc.Features.Applications;

[ApiController]
[Route("applications")]
public class ApplicationsController(ApplicationService applications) : ControllerBase
{
    // A whole application is a few KB; anything over 64 KB is refused before it's read.
    private const int MaxBodyBytes = 64 * 1024;

    [HttpPost]
    [EnableRateLimiting(RateLimits.Submit)]
    [RequestSizeLimit(MaxBodyBytes)]
    [ProducesResponseType(typeof(SubmitApplicationResult), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(HttpValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status429TooManyRequests)]
    public async Task<ActionResult<SubmitApplicationResult>> Submit(SubmitApplicationRequest request, CancellationToken ct)
    {
        var result = await applications.SubmitAsync(request, ct);

        // 201 without a Location header: there's no public address to read an application back.
        return StatusCode(StatusCodes.Status201Created, result);
    }
}
