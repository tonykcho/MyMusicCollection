using Microsoft.EntityFrameworkCore;
using MusicApi.Abstracts;
using MusicApi.DbContexts;
using MusicApi.Dtos;
using MusicApi.Mappers;

namespace MusicApi.Handlers;

public class GetMusicRequest : IApiRequest
{
    public Guid MusicId { get; set; }
}

public class GetMusicHandler : IApiRequestHandler<GetMusicRequest>
{
    private readonly AppDbContext _dbContext;

    public GetMusicHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IApiResult> HandleAsync(GetMusicRequest request, CancellationToken cancellationToken)
    {
        var music = await _dbContext.Musics
            .Where(music => music.IsDeleted == false)
            .SingleOrDefaultAsync(music => music.Id == request.MusicId, cancellationToken);

        if (music == null)
        {
            return new NotFoundApiResult($"Music with ID {request.MusicId} not found");
        }

        var dto = MusicMapper.MapToDto(music);

        return new ContentApiResult<MusicDto>(dto);
    }
}