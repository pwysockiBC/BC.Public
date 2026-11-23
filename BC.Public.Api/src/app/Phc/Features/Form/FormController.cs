// GET /form: what the application form loads first. Never cached, since each response carries
// a new form token.

using BC.Public.Phc.Shared.Spam;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BC.Public.Phc.Features.Form;

[ApiController]
[Route("form")]
public class FormController(FormService form) : ControllerBase
{
    [HttpGet]
    [EnableRateLimiting(RateLimits.Form)]
    [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
    public Task<FormResponse> Get(CancellationToken ct)
    {
        return form.GetAsync(ct);
    }
}
