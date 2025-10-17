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

        musicGroup.MapGet("/", (ApiRequestPipeline apiRequestPipeline, [FromQuery] int offset = 0, [FromQuery] int limit = 20) =>
        {
            var request = new GetMusicsRequest
            {
                Offset = offset,
                Limit = limit
            };

            var result = apiRequestPipeline.RunPipeLineAsync(request, new CancellationToken()).Result;

            return result.MapToResult();
        })
        .WithName("GetMusics")
        .WithSummary("Retrieve all music entries")
        .WithDescription("Retrieves a list of all music entries in the collection.")
        .Produces<List<Music>>(StatusCodes.Status200OK);

        musicGroup.MapGet("/{id:guid}", async ([FromRoute] Guid id, ApiRequestPipeline apiRequestPipeline) =>
        {
            var request = new GetMusicRequest { MusicId = id };
            var result = await apiRequestPipeline.RunPipeLineAsync(request, new CancellationToken());

            return result.MapToResult();
        })
        .WithName("GetMusicById")
        .WithSummary("Retrieve a music entry by ID")
        .WithDescription("Retrieves a specific music entry by its unique ID.")
        .Produces<Music>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        musicGroup.MapPost("/", async ([FromBody] CreateMusicRequest request, ApiRequestPipeline apiRequestPipeline) =>
        {
            var result = await apiRequestPipeline.RunPipeLineAsync(request, new CancellationToken());

            return result.MapToResult();
        })
        .DisableAntiforgery()
        .WithName("CreateMusic")
        .WithSummary("Create a new music entry")
        .WithDescription("Creates a new music entry in the collection.")
        .Produces<CreatedResult>(StatusCodes.Status201Created);

        musicGroup.MapPost("{musicId:guid}/favorite", async ([FromRoute] Guid musicId, ApiRequestPipeline apiRequestPipeline) =>
        {
            var request = new SetFavoriteMusicRequest { MusicId = musicId };
            var result = await apiRequestPipeline.RunPipeLineAsync(request, new CancellationToken());

            return result.MapToResult();
        })
        .WithName("SetFavoriteMusic")
        .WithSummary("Set a music entry as favorite")
        .WithDescription("Marks a music entry as favorite.")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound);

        musicGroup.MapPost("{musicId:guid}/unfavorite", async ([FromRoute] Guid musicId, ApiRequestPipeline apiRequestPipeline) =>
        {
            var request = new UnsetFavoriteMusicRequest { MusicId = musicId };
            var result = await apiRequestPipeline.RunPipeLineAsync(request, new CancellationToken());

            return result.MapToResult();
        })
        .WithName("UnsetFavoriteMusic")
        .WithSummary("Unset a music entry as favorite")
        .WithDescription("Remove favorite mark from a music entry.")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound);

        musicGroup.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateMusicRequest request, ApiRequestPipeline apiRequestPipeline) =>
        {
            request.MusicId = id;

            var result = await apiRequestPipeline.RunPipeLineAsync(request, new CancellationToken());

            return result.MapToResult();
        })
        .WithName("UpdateMusic")
        .WithSummary("Update a music entry")
        .WithDescription("Updates an existing music entry in the collection.")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status404NotFound);

        musicGroup.MapDelete("/{musicId:guid}", async ([FromRoute] Guid musicId, ApiRequestPipeline apiRequestPipeline) =>
        {
            var request = new DeleteMusicRequest { MusicId = musicId };
            var result = await apiRequestPipeline.RunPipeLineAsync(request, new CancellationToken());

            return result.MapToResult();
        })
        .WithName("DeleteMusic")
        .WithSummary("Delete a music entry")
        .WithDescription("Deletes a music entry from the collection.")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound);
    }
}