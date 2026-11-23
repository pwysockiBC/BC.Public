// A language applicants can say they speak. Read only; only active ones are offered.

namespace BC.Public.Phc.Data.Entities;

public class SpokenLanguage
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
}
