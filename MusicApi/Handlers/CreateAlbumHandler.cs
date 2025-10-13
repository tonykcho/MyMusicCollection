using FluentValidation;
using MusicApi.Abstracts;
using MusicApi.DbContexts;
using MusicApi.Models;
using MusicApi.Services;

namespace MusicApi.Handlers;

public class CreateAlbumRequest : IApiRequest
{
    public string Title { get; set; } = string.Empty;
    public string Artist { get; set; } = string.Empty;
    public DateTimeOffset ReleaseDate { get; set; } = DateTimeOffset.MinValue;
    public IFormFile? CoverImage { get; set; }
}

public class CreateAlbumRequestValidator : AbstractValidator<CreateAlbumRequest>
{
    public CreateAlbumRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty()
            .WithMessage("Title is required.");
        RuleFor(x => x.Artist).NotEmpty()
            .WithMessage("Artist is required.");
        RuleFor(x => x.ReleaseDate).NotEmpty()
            .WithMessage("Release Date is required.");
    }
}

public class CreateAlbumHandler : IApiRequestHandler<CreateAlbumRequest>
{
    private readonly AppDbContext _dbContext;
    private readonly ImageStorageService _imageStorageService;
    public CreateAlbumHandler(AppDbContext dbContext, ImageStorageService imageStorageService)
    {
        _dbContext = dbContext;
        _imageStorageService = imageStorageService;
    }

    public async Task<IApiResult> HandleAsync(CreateAlbumRequest request, CancellationToken cancellationToken)
    {
        var album = new Album
        {
            Title = request.Title,
            Artist = request.Artist,
            ReleaseDate = request.ReleaseDate.ToUniversalTime(),
        };

        if (request.CoverImage != null)
        {
            var imagePath = await _imageStorageService.SaveImageAsync(request.CoverImage, cancellationToken);
            album.CoverImagePath = imagePath;
        }

        await _dbContext.Albums.AddAsync(album);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new NoContentApiResult();
    }
}