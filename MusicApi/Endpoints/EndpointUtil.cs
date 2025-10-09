using MusicApi.Abstracts;

namespace MusicApi.Endpoints;

public static class EndpointUtil
{
    public static IResult MapToResult(this IApiResult result)
    {
        var resultType = result.GetType();
        if (resultType.IsGenericType && resultType.GetGenericTypeDefinition() == typeof(ContentApiResult<>))
        {
            var data = result.GetData();
            return data is not null
                ? Results.Ok(data)
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