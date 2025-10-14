using MusicApi.Dtos;
using MusicApi.Models;

namespace MusicApi.Mappers;

public class AlbumMapper
{
    public static AlbumDto MapToDto(Album album)
    {
        return new AlbumDto
        {
            Id = album.Id,
            Title = album.Title,
            Artist = album.Artist,
            ReleaseDate = album.ReleaseDate,
            HasCoverImage = !string.IsNullOrEmpty(album.CoverImagePath),
            Musics = album.Musics.Select(MusicMapper.MapToDto).ToList()
        };
    }
}