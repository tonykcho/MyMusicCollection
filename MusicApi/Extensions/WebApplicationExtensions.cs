using MusicApi.Endpoints;

namespace MusicApi.Extensions;

public static class WebApplicationExtension
{
    public static WebApplication MapApiEndpoints(this WebApplication app)
    {
        app.MapMusicApiEndpoints();
        app.MapAlbumApiEndpoints();

        return app;
    }
}