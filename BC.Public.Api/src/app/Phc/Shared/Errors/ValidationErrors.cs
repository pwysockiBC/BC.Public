// Collects field errors while rules are checked, so every problem is reported at once.

namespace BC.Public.Phc.Shared.Errors;

public sealed class ValidationErrors
{
    private readonly Dictionary<string, List<string>> errors = [];

    public bool Any => errors.Count > 0;

    public void Add(string field, string message)
    {
        if (!errors.TryGetValue(field, out var messages))
        {
            messages = [];
            errors[field] = messages;
        }
        messages.Add(message);
    }

    public bool Has(string field)
    {
        return errors.ContainsKey(field);
    }

    // Throws if anything was added.
    public void ThrowIfAny()
    {
        if (!Any)
        {
            return;
        }

        var result = new Dictionary<string, string[]>();
        foreach (var pair in errors)
        {
            result[pair.Key] = [.. pair.Value];
        }
        throw new ValidationException(result);
    }
}
