namespace MusicApi.Models;

public class Album : BaseModel
{
    public string Title { get; set; } = string.Empty;
    public string Artist { get; set; } = string.Empty;
    public DateTimeOffset ReleaseDate { get; set; }
    public IList<Music> Musics { get; set; } = new List<Music>();
}