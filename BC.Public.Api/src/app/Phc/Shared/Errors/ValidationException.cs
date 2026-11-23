// Thrown when a submission breaks a rule. ApiExceptionHandler answers it with 400 and the
// field errors, keyed by camelCase JSON path (e.g. "participation.donationDetails").

namespace BC.Public.Phc.Shared.Errors;

public sealed class ValidationException : Exception
{
    public IDictionary<string, string[]> Errors { get; }

    // One broken rule.
    public ValidationException(string field, string message)
        : this(new Dictionary<string, string[]> { [field] = [message] })
    {
    }

    // Several at once, so the person sees every problem in one round trip.
    public ValidationException(IDictionary<string, string[]> errors)
        : base("One or more rules were broken.")
    {
        Errors = errors;
    }
}
