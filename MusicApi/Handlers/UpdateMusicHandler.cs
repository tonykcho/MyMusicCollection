using FluentValidation;
using Microsoft.EntityFrameworkCore;
using MusicApi.Abstracts;
using MusicApi.DbContexts;

namespace MusicApi.Handlers;

public class UpdateMusicRequest : IApiRequest
{
    public Guid MusicId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Artist { get; set; } = string.Empty;
    public DateTimeOffset ReleaseDate { get; set; } = DateTimeOffset.MinValue;
}

public class UpdateMusicRequestValidator : AbstractValidator<UpdateMusicRequest>
{
    public UpdateMusicRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty()
            .WithMessage("Title is required.");
        RuleFor(x => x.Artist).NotEmpty()
            .WithMessage("Artist is required.");
        RuleFor(x => x.ReleaseDate).NotEmpty()
            .WithMessage("Release Date is required.");
    }
}

public class UpdateMusicHandler : IApiRequestHandler<UpdateMusicRequest>
{
    private readonly AppDbContext _dbContext;

    public UpdateMusicHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IApiResult> HandleAsync(UpdateMusicRequest request, CancellationToken cancellationToken)
    {
        var music = await _dbContext.Musics
            .Where(music => music.IsDeleted == false)
            .SingleOrDefaultAsync(music => music.Id == request.MusicId, cancellationToken);

        if (music == null)
        {
            return new NotFoundApiResult($"Music with ID {request.MusicId} not found");
        }

        music.Title = request.Title;
        music.Artist = request.Artist;
        music.ReleaseDate = request.ReleaseDate.ToUniversalTime();

        _dbContext.Musics.Update(music);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new NoContentApiResult();
    }
}