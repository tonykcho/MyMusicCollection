namespace MusicApi.Models;

public class Music : BaseModel
{
    public string Title { get; set; } = string.Empty;
    public string Artist { get; set; } = string.Empty;
    public DateTimeOffset ReleaseDate { get; set; }
    public Guid? AlbumId { get; set; }
    public bool IsFavorite { get; set; }
}