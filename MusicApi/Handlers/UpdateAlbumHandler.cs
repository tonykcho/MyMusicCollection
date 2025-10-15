using FluentValidation;
using Microsoft.EntityFrameworkCore;
using MusicApi.Abstracts;
using MusicApi.DbContexts;

namespace MusicApi.Handlers;

public class UpdateAlbumRequest : IApiRequest
{
    public Guid AlbumId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Artist { get; set; } = string.Empty;
    public DateTimeOffset ReleaseDate { get; set; } = DateTimeOffset.MinValue;
}

public class UpdateAlbumRequestValidator : AbstractValidator<UpdateAlbumRequest>
{
    public UpdateAlbumRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty()
            .WithMessage("Title is required.");
        RuleFor(x => x.Artist).NotEmpty()
            .WithMessage("Artist is required.");
        RuleFor(x => x.ReleaseDate).NotEmpty()
            .WithMessage("Release Date is required.");
    }
}

public class UpdateAlbumHandler : IApiRequestHandler<UpdateAlbumRequest>
{
    private readonly AppDbContext _dbContext;

    public UpdateAlbumHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IApiResult> HandleAsync(UpdateAlbumRequest request, CancellationToken cancellationToken)
    {
        var album = await _dbContext.Albums
            .Where(album => album.IsDeleted == false)
            .SingleOrDefaultAsync(album => album.Id == request.AlbumId, cancellationToken);

        if (album == null)
        {
            return new NotFoundApiResult($"Album with ID {request.AlbumId} not found");
        }

        album.Title = request.Title;
        album.Artist = request.Artist;
        album.ReleaseDate = request.ReleaseDate.ToUniversalTime();

        _dbContext.Albums.Update(album);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new NoContentApiResult();
    }
}