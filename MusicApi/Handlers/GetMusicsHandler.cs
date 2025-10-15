using Microsoft.EntityFrameworkCore;
using MusicApi.Abstracts;
using MusicApi.DbContexts;
using MusicApi.Dtos;
using MusicApi.Mappers;
using MusicApi.Models;

namespace MusicApi.Handlers;

public class GetMusicsRequest : IApiRequest
{

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
            .ToListAsync();

        var musicDtos = musics.Select(MusicMapper.MapToDto).ToList();

        var result = new ContentApiResult<List<MusicDto>>(musicDtos);

        return result;
    }
}