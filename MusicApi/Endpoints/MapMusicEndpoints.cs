using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MusicApi.Abstracts;
using MusicApi.Handlers;

namespace MusicApi.Endpoints;

public static class MapMusicEndpoints
{
    public static void MapMusicApiEndpoints(this IEndpointRouteBuilder app)
    {
        var musicGroup = app.MapGroup("/api/music")
            .WithTags("Music API");

        musicGroup.MapGet("/", () => "Welcome to the Music API!")
            .WithName("Welcome")
            .WithSummary("Welcome message for the Music API")
            .WithDescription("Returns a welcome message to confirm that the Music API is running.")
            .Produces<string>(StatusCodes.Status200OK);

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