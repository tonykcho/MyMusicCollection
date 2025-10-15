using Microsoft.EntityFrameworkCore;
using MusicApi.Abstracts;
using MusicApi.DbContexts;
using MusicApi.Services;

namespace MusicApi.Handlers;

public class GetAlbumCoverImageRequest : IApiRequest
{
    public Guid AlbumId { get; set; }
}

public class GetAlbumCoverImageHandler : IApiRequestHandler<GetAlbumCoverImageRequest>
{
    private readonly AppDbContext _dbContext;
    private readonly ImageStorageService _imageStorageService;
    public GetAlbumCoverImageHandler(AppDbContext dbContext, ImageStorageService imageStorageService)
    {
        _dbContext = dbContext;
        _imageStorageService = imageStorageService;
    }
    public async Task<IApiResult> HandleAsync(GetAlbumCoverImageRequest request, CancellationToken cancellationToken)
    {
        var album = await _dbContext.Albums
            .Where(album => album.IsDeleted == false)
            .SingleOrDefaultAsync(a => a.Id == request.AlbumId, cancellationToken);

        if (album == null || string.IsNullOrEmpty(album.CoverImagePath))
        {
            return new NotFoundApiResult();
        }

        try
        {
            var imageData = await _imageStorageService.GetImageAsync(album.CoverImagePath);
            return new FileApiResult(imageData, "image/jpeg"); // Assuming JPEG, adjust as necessary
        }
        catch (FileNotFoundException)
        {
            return new NotFoundApiResult();
        }
    }
}