using Microsoft.EntityFrameworkCore;
using MusicApi.Abstracts;
using MusicApi.DbContexts;
using MusicApi.Dtos;
using MusicApi.Mappers;

namespace MusicApi.Handlers;

public class GetAlbumRequest : IApiRequest
{
    public Guid AlbumId { get; set; }
}

public class GetAlbumHandler : IApiRequestHandler<GetAlbumRequest>
{
    private readonly AppDbContext _dbContext;

    public GetAlbumHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IApiResult> HandleAsync(GetAlbumRequest request, CancellationToken cancellationToken)
    {
        var album = await _dbContext.Albums
            .Where(album => album.IsDeleted == false)
            .Include(album => album.Musics)
            .SingleOrDefaultAsync(album => album.Id == request.AlbumId, cancellationToken);

        if (album == null)
        {
            return new NotFoundApiResult($"Album with ID {request.AlbumId} not found");
        }

        var dto = AlbumMapper.MapToDto(album);

        return new ContentApiResult<AlbumDto>(dto);
    }
}