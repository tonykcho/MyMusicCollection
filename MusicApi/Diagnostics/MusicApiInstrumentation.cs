using System.Diagnostics;

namespace MusicApi.Diagnostics;

public static class MusicApiInstrumentation
{
    public const string ActivitySourceName = "MyMusicCollection.Api";
    public static readonly ActivitySource ActivitySource = new(ActivitySourceName);
}