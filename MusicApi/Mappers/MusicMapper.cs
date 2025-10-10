using MusicApi.Dtos;
using MusicApi.Models;

namespace MusicApi.Mappers;

public class MusicMapper
{
    public static MusicDto MapToDto(Music music)
    {
        return new MusicDto
        {
            Title = music.Title,
            Artist = music.Artist,
            ReleaseDate = music.ReleaseDate,
            AlbumId = music.AlbumId
        };
    }
}