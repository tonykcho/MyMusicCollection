using Microsoft.EntityFrameworkCore;
using MusicApi.Abstracts;
using MusicApi.DbContexts;

namespace MusicApi.Handlers;

public class SetFavoriteMusicRequest : IApiRequest
{
    public Guid MusicId { get; set; }
}

public class SetFavoriteMusicHandler : IApiRequestHandler<SetFavoriteMusicRequest>
{
    private readonly AppDbContext _dbContext;

    public SetFavoriteMusicHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IApiResult> HandleAsync(SetFavoriteMusicRequest request, CancellationToken cancellationToken)
    {
        var music = await _dbContext.Musics
            .SingleOrDefaultAsync(music => music.Id == request.MusicId, cancellationToken);

        if (music == null)
        {
            return new NotFoundApiResult("Music not found.");
        }

        music.IsFavorite = true;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new NoContentApiResult();
    }
}