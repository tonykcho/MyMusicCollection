using MusicApi.Models;

namespace MusicApi.Dtos;

public class MusicDto
{
    public string Title { get; init; } = string.Empty;
    public string Artist { get; init; } = string.Empty;
    public DateTimeOffset ReleaseDate { get; init; }
    public Guid? AlbumId { get; init; }
}