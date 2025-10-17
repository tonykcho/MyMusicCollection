using MusicApi.Dtos;
using MusicApi.Models;

namespace MusicApi.Mappers;

public class MusicMapper
{
    public static MusicDto MapToDto(Music music)
    {
        return new MusicDto
        {
            Id = music.Id,
            Title = music.Title,
            Artist = music.Artist,
            ReleaseDate = music.ReleaseDate,
            AlbumId = music.AlbumId,
            IsFavorite = music.IsFavorite
        };
    }
}