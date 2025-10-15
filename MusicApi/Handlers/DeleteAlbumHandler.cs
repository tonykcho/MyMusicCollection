using Microsoft.EntityFrameworkCore;
using MusicApi.Abstracts;
using MusicApi.DbContexts;

namespace MusicApi.Handlers;

public class DeleteAlbumRequest : IApiRequest
{
    public Guid AlbumId { get; set; }
}

public class DeleteAlbumHandler : IApiRequestHandler<DeleteAlbumRequest>
{
    private readonly AppDbContext _dbContext;

    public DeleteAlbumHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IApiResult> HandleAsync(DeleteAlbumRequest request, CancellationToken cancellationToken)
    {
        var album = await _dbContext.Albums
            .SingleOrDefaultAsync(album => album.Id == request.AlbumId);

        if (album == null)
        {
            return new NotFoundApiResult($"Album with ID {request.AlbumId} not found");
        }

        _dbContext.Albums.Remove(album);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new NoContentApiResult();
    }
}