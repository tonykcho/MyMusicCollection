using MusicApi.Dtos;
using MusicApi.Models;

namespace MusicApi.Mappers;

public class AlbumMapper
{
    public static AlbumDto MapToDto(Album album)
    {
        return new AlbumDto
        {
            Title = album.Title,
            Artist = album.Artist,
            ReleaseDate = album.ReleaseDate,
            Musics = album.Musics.Select(MusicMapper.MapToDto).ToList()
        };
    }
}