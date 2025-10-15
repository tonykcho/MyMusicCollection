using Microsoft.EntityFrameworkCore;
using MusicApi.Abstracts;
using MusicApi.DbContexts;

namespace MusicApi.Handlers;

public class DeleteMusicRequest : IApiRequest
{
    public Guid MusicId { get; set; }
}

public class DeleteMusicHandler : IApiRequestHandler<DeleteMusicRequest>
{
    private readonly AppDbContext _dbContext;

    public DeleteMusicHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IApiResult> HandleAsync(DeleteMusicRequest request, CancellationToken cancellationToken)
    {
        var music = await _dbContext.Musics
            .Where(music => music.IsDeleted == false)
            .SingleOrDefaultAsync(music => music.Id == request.MusicId, cancellationToken);

        if (music == null)
        {
            return new NotFoundApiResult($"Music with ID {request.MusicId} not found");
        }

        _dbContext.Musics.Remove(music);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new NoContentApiResult();
    }
}