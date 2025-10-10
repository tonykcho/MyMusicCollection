using Microsoft.AspNetCore.Mvc;
using MusicApi.Abstracts;
using MusicApi.Handlers;
using MusicApi.Models;

namespace MusicApi.Endpoints;

public static class MapMusicEndpoints
{
    public static void MapMusicApiEndpoints(this IEndpointRouteBuilder app)
    {
        var musicGroup = app.MapGroup("/api/music")
            .WithTags("Music API");

        musicGroup.MapGet("/", (ApiRequestPipeline apiRequestPipeline) =>
        {
            var result = apiRequestPipeline.RunPipeLineAsync(new GetMusicsRequest(), new CancellationToken()).Result;

            return result.MapToResult();
        })
        .WithName("GetMusics")
        .WithSummary("Retrieve all music entries")
        .WithDescription("Retrieves a list of all music entries in the collection.")
        .Produces<List<Music>>(StatusCodes.Status200OK);

        musicGroup.MapPost("/", async ([FromBody] CreateMusicRequest request, ApiRequestPipeline apiRequestPipeline) =>
        {
            var result = await apiRequestPipeline.RunPipeLineAsync(request, new CancellationToken());

            return result.MapToResult();
        })
        .WithName("CreateMusic")
        .WithSummary("Create a new music entry")
        .WithDescription("Creates a new music entry in the collection.")
        .Produces<CreatedResult>(StatusCodes.Status201Created);
    }
}