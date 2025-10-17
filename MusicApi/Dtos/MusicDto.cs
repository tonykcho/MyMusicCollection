using MusicApi.Models;

namespace MusicApi.Dtos;

public class MusicDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Artist { get; set; } = string.Empty;
    public DateTimeOffset ReleaseDate { get; set; }
    public bool HasCoverImage { get; set; } = false;
    public Guid? AlbumId { get; set; }
    public bool IsFavorite { get; set; } = false;
}