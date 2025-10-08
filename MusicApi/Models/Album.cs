namespace MusicApi.Models;

public class Album : BaseModel
{
    public required string Title { get; set; }
    public required string Artist { get; set; }
    public DateTimeOffset ReleaseDate { get; set; }
    public IList<Music> Musics { get; set; } = new List<Music>();
}