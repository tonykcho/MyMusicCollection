namespace MusicApi.Models;

public class Music : BaseModel
{
    public required string Title { get; set; }
    public required string Artist { get; set; }
    public DateTimeOffset ReleaseDate { get; set; }
    public Guid? AlbumId { get; set; }
}