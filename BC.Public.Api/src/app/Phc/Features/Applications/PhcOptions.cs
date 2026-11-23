// PHC settings from the "Phc" configuration section. Checked when the app starts.

using System.ComponentModel.DataAnnotations;

namespace BC.Public.Phc.Features.Applications;

public sealed class PhcOptions
{
    public const string Section = "Phc";

    // The version of the agreements text the form currently shows, e.g. "2027-1".
    // Applications that accepted any other version are refused with "reload the page".
    [Required, MaxLength(20)]
    public string AgreementsVersion { get; set; } = "";
}
