using FluentValidation;
using MusicApi.Abstracts;
using MusicApi.DbContexts;
using MusicApi.Models;

namespace MusicApi.Handlers;

public class CreateMusicRequest : IApiRequest
{
    public string Title { get; set; } = string.Empty;
    public string Artist { get; set; } = string.Empty;
    public DateTimeOffset ReleaseDate { get; set; }
}

public class CreateMusicRequestValidator : AbstractValidator<CreateMusicRequest>
{
    public CreateMusicRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty()
            .WithMessage("Title is required.");
        RuleFor(x => x.Artist).NotEmpty()
            .WithMessage("Artist is required.");
        RuleFor(x => x.ReleaseDate).NotEmpty()
            .WithMessage("Release date is required.");
    }
}

public class CreateMusicHandler : IApiRequestHandler<CreateMusicRequest>
{
    private readonly AppDbContext _dbContext;
    public CreateMusicHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IApiResult> HandleAsync(CreateMusicRequest request, CancellationToken cancellationToken)
    {
        var music = new Music
        {
            Title = request.Title,
            Artist = request.Artist,
            ReleaseDate = request.ReleaseDate.ToUniversalTime(),
        };

        await _dbContext.Musics.AddAsync(music);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new NoContentApiResult();
    }
}