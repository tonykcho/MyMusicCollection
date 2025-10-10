using Microsoft.EntityFrameworkCore;
using MusicApi.Abstracts;
using MusicApi.DbContexts;
using MusicApi.Dtos;
using MusicApi.Mappers;
using MusicApi.Models;

namespace MusicApi.Handlers;

public class GetAlbumsRequest : IApiRequest
{
}

public class GetAlbumsHandler : IApiRequestHandler<GetAlbumsRequest>
{
    private readonly AppDbContext _dbContext;
    public GetAlbumsHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task<IApiResult> HandleAsync(GetAlbumsRequest request, CancellationToken cancellationToken)
    {
        var albums = await _dbContext.Albums
            .ToListAsync(cancellationToken);

        var albumDtos = albums.Select(AlbumMapper.MapToDto).ToList();

        var result = new ContentApiResult<List<AlbumDto>>(albumDtos);

        return result;
    }
}