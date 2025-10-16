using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MusicApi.Abstracts;
using MusicApi.DbContexts;
using MusicApi.Dtos;
using MusicApi.Mappers;
using MusicApi.Models;

namespace MusicApi.Handlers;

public class GetMusicsRequest : IApiRequest
{
    public int Offset { get; set; } = 0;
    public int Limit { get; set; } = 20;
}

public class GetMusicsHandler : IApiRequestHandler<GetMusicsRequest>
{
    private readonly AppDbContext _dbContext;
    public GetMusicsHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IApiResult> HandleAsync(GetMusicsRequest request, CancellationToken cancellationToken)
    {
        var musics = await _dbContext.Musics
            .Where(music => music.IsDeleted == false)
            .OrderBy(music => music.Artist)
            .ThenBy(music => music.AlbumId)
            .ThenBy(music => music.CreatedAt)
            .Skip(request.Offset)
            .Take(request.Limit)
            .ToListAsync();

        var musicDtos = musics.Select(MusicMapper.MapToDto).ToList();

        await LoadMusicCover(musicDtos);

        var result = new ContentApiResult<List<MusicDto>>(musicDtos);

        return result;
    }

    private async Task LoadMusicCover(List<MusicDto> musicDtos)
    {
        IList<Guid> albumIds = musicDtos
            .Where(music => music.AlbumId.HasValue)
            .Select(music => music.AlbumId!.Value)
            .Distinct()
            .ToList();

        IDictionary<Guid, bool> albumCoverMap = await _dbContext.Albums
            .Where(album => albumIds.Contains(album.Id))
            .ToDictionaryAsync(album => album.Id, album => album.CoverImagePath != null);

        foreach (var music in musicDtos)
        {
            if (music.AlbumId.HasValue && albumCoverMap.TryGetValue(music.AlbumId.Value, out bool hasCoverImage))
            {
                music.HasCoverImage = hasCoverImage;
            }
        }
    }
}