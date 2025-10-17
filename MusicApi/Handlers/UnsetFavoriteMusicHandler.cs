using Microsoft.EntityFrameworkCore;
using MusicApi.Abstracts;
using MusicApi.DbContexts;

namespace MusicApi.Handlers;

public class UnsetFavoriteMusicRequest : IApiRequest
{
    public Guid MusicId { get; set; }
}

public class UnsetFavoriteMusicHandler : IApiRequestHandler<UnsetFavoriteMusicRequest>
{
    private readonly AppDbContext _dbContext;

    public UnsetFavoriteMusicHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IApiResult> HandleAsync(UnsetFavoriteMusicRequest request, CancellationToken cancellationToken)
    {
        var music = await _dbContext.Musics
            .SingleOrDefaultAsync(music => music.Id == request.MusicId, cancellationToken);

        if (music == null)
        {
            return new NotFoundApiResult("Music not found.");
        }

        music.IsFavorite = false;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new NoContentApiResult();
    }
}