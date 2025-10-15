using System.Transactions;
using Microsoft.EntityFrameworkCore;
using MusicApi.Abstracts;
using MusicApi.DbContexts;
using MusicApi.Services;

namespace MusicApi.Handlers;

public class DeleteAlbumRequest : IApiRequest
{
    public Guid AlbumId { get; set; }
}

public class DeleteAlbumHandler : IApiRequestHandler<DeleteAlbumRequest>
{
    private readonly AppDbContext _dbContext;
    private readonly ImageStorageService _imageStorageService;

    public DeleteAlbumHandler(AppDbContext dbContext, ImageStorageService imageStorageService)
    {
        _dbContext = dbContext;
        _imageStorageService = imageStorageService;
    }

    public async Task<IApiResult> HandleAsync(DeleteAlbumRequest request, CancellationToken cancellationToken)
    {
        var album = await _dbContext.Albums
            .SingleOrDefaultAsync(album => album.Id == request.AlbumId);

        if (album == null)
        {
            return new NotFoundApiResult($"Album with ID {request.AlbumId} not found");
        }

        using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
        {

            _dbContext.Entry(album).Collection(album => album.Musics).Load();
            foreach (var music in album.Musics)
            {
                _dbContext.Musics.Remove(music);
            }

            if (album.CoverImagePath != null)
            {
                await _imageStorageService.DeleteImageAsync(album.CoverImagePath);
            }

            _dbContext.Albums.Remove(album);
            await _dbContext.SaveChangesAsync(cancellationToken);

            scope.Complete();
        }

        return new NoContentApiResult();
    }
}