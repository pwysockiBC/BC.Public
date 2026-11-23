// Reference numbers like "PHC-7K4M9Q": 6 random characters from an alphabet with no look-alikes
// (no 0/O, 1/I/L, or U), easy to read over the phone. 30^6 is about 729 million codes, so a
// clash is rare; the unique index catches one and the caller draws again.

using System.Security.Cryptography;

namespace BC.Public.Phc.Features.Applications;

public static class ReferenceNumbers
{
    public const string Prefix = "PHC-";
    public const string Alphabet = "23456789ABCDEFGHJKMNPQRSTVWXYZ";
    public const int Length = 6;

    public static string New()
    {
        var chars = new char[Length];
        for (var i = 0; i < Length; i++)
        {
            chars[i] = Alphabet[RandomNumberGenerator.GetInt32(Alphabet.Length)];
        }
        return Prefix + new string(chars);
    }
}
