using Microsoft.AspNetCore.Mvc;
using MusicApi.Abstracts;
using MusicApi.Handlers;

namespace MusicApi.Endpoints;

public static class MapAlbumEndpoints
{
    public static void MapAlbumApiEndpoints(this IEndpointRouteBuilder app)
    {
        var albumGroup = app.MapGroup("/api/albums")
            .WithTags("Album API");

        albumGroup.MapGet("/", async (ApiRequestPipeline apiRequestPipeline) =>
        {
            var request = new GetAlbumsRequest();
            var result = await apiRequestPipeline.RunPipeLineAsync(request, new CancellationToken());

            return result.MapToResult();
        })
        .WithName("GetAlbums")
        .WithSummary("Get all albums")
        .WithDescription("Retrieves a list of all albums in the collection.")
        .Produces<OkObjectResult>(StatusCodes.Status200OK);

        albumGroup.MapPost("/", async ([FromBody] CreateAlbumRequest request, ApiRequestPipeline apiRequestPipeline) =>
        {
            var result = await apiRequestPipeline.RunPipeLineAsync(request, new CancellationToken());

            return result.MapToResult();
        })
        .WithName("CreateAlbum")
        .WithSummary("Create a new album entry")
        .WithDescription("Creates a new album entry in the collection.")
        .Produces<CreatedResult>(StatusCodes.Status201Created);
    }
}