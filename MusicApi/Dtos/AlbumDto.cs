namespace MusicApi.Dtos;

public sealed record AlbumDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Artist { get; init; } = string.Empty;
    public DateTimeOffset ReleaseDate { get; init; }
    public IList<MusicDto> Musics { get; init; } = new List<MusicDto>();
}