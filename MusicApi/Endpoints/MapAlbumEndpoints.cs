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

        albumGroup.MapGet("/", async ([FromQuery] int offset, [FromQuery] int limit, ApiRequestPipeline apiRequestPipeline) =>
        {
            var request = new GetAlbumsRequest { Offset = offset, Limit = limit };
            var result = await apiRequestPipeline.RunPipeLineAsync(request, new CancellationToken());

            return result.MapToResult();
        })
        .WithName("GetAlbums")
        .WithSummary("Get all albums")
        .WithDescription("Retrieves a list of all albums in the collection.")
        .Produces<OkObjectResult>(StatusCodes.Status200OK);

        albumGroup.MapGet("/{id:guid}", async (Guid id, ApiRequestPipeline apiRequestPipeline) =>
        {
            var request = new GetAlbumRequest { AlbumId = id };
            var result = await apiRequestPipeline.RunPipeLineAsync(request, new CancellationToken());

            return result.MapToResult();
        })
        .WithName("GetAlbumById")
        .WithSummary("Get album by ID")
        .WithDescription("Retrieves a specific album by its unique ID.")
        .Produces<OkObjectResult>(StatusCodes.Status200OK)
        .Produces<NotFoundObjectResult>(StatusCodes.Status404NotFound);

        albumGroup.MapGet("/{id:guid}/cover", async (Guid id, ApiRequestPipeline apiRequestPipeline) =>
        {
            var request = new GetAlbumCoverImageRequest { AlbumId = id };
            var result = await apiRequestPipeline.RunPipeLineAsync(request, new CancellationToken());

            return result.MapToResult();
        });

        albumGroup.MapPost("/", async ([FromForm] CreateAlbumRequest request, ApiRequestPipeline apiRequestPipeline) =>
        {
            var result = await apiRequestPipeline.RunPipeLineAsync(request, new CancellationToken());

            return result.MapToResult();
        })
        .DisableAntiforgery()
        .WithName("CreateAlbum")
        .WithSummary("Create a new album entry")
        .WithDescription("Creates a new album entry in the collection.")
        .Produces<CreatedResult>(StatusCodes.Status201Created);

        albumGroup.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateAlbumRequest request, ApiRequestPipeline apiRequestPipeline) =>
        {
            request.AlbumId = id;

            var result = await apiRequestPipeline.RunPipeLineAsync(request, new CancellationToken());

            return result.MapToResult();
        })
        .WithName("UpdateAlbum")
        .WithSummary("Update an existing album")
        .WithDescription("Updates the details of an existing album in the collection.")
        .Produces<NoContentResult>(StatusCodes.Status204NoContent)
        .Produces<BadRequestObjectResult>(StatusCodes.Status400BadRequest)
        .Produces<NotFoundObjectResult>(StatusCodes.Status404NotFound);

        albumGroup.MapDelete("/{id:guid}", async (Guid id, ApiRequestPipeline apiRequestPipeline) =>
        {
            var request = new DeleteAlbumRequest { AlbumId = id };
            var result = await apiRequestPipeline.RunPipeLineAsync(request, new CancellationToken());

            return result.MapToResult();
        })
        .WithName("DeleteAlbum")
        .WithSummary("Delete an album by ID")
        .WithDescription("Deletes a specific album by its unique ID.")
        .Produces<NoContentResult>(StatusCodes.Status204NoContent)
        .Produces<NotFoundObjectResult>(StatusCodes.Status404NotFound);
    }
}