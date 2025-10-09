namespace MusicApi.Abstracts
{
    public interface IApiResult
    {
    }

    public interface IApiResult<T> : IApiResult
    {
        T Data { get; set; }
    }

    public sealed class NoContentApiResult : IApiResult
    {
    }

    public sealed class BadRequestApiResult : IApiResult
    {
    }

    public sealed class NotFoundApiResult : IApiResult
    {
    }

    public sealed class TaskCancelledApiResult : IApiResult
    {
    }
}