using MusicApi.Abstracts;

namespace MusicApi.Endpoints;

public static class EndpointUtil
{
    public static IResult MapToResult(this IApiResult result)
    {
        return result switch
        {
            NoContentApiResult => Results.NoContent(),
            BadRequestApiResult => Results.BadRequest(),
            NotFoundApiResult => Results.NotFound(),
            TaskCancelledApiResult => Results.StatusCode(StatusCodes.Status499ClientClosedRequest),
            _ => Results.StatusCode(StatusCodes.Status500InternalServerError)
        };
    }

    public static IResult MapToResult<T>(this IApiResult result)
    {
        if (result is IApiResult<T> typedResult)
        {
            return typedResult.Data is not null
                ? Results.Ok(typedResult.Data)
                : Results.NoContent();
        }

        return result switch
        {
            NoContentApiResult => Results.NoContent(),
            BadRequestApiResult => Results.BadRequest(),
            NotFoundApiResult => Results.NotFound(),
            TaskCancelledApiResult => Results.StatusCode(StatusCodes.Status499ClientClosedRequest),
            _ => Results.StatusCode(StatusCodes.Status500InternalServerError)
        };
    }
}