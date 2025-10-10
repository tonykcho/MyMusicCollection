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
            ReleaseDate = request.ReleaseDate
        };

        await _dbContext.Musics.AddAsync(music);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new NoContentApiResult();
    }
}