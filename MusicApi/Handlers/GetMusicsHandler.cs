using Microsoft.EntityFrameworkCore;
using MusicApi.Abstracts;
using MusicApi.DbContexts;
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
            .ToListAsync();

        var result = new ContentApiResult<List<Music>>(musics);

        return result;
    }
}