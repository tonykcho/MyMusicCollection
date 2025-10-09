namespace MusicApi.Abstracts
{
    public interface IApiResult
    {
        virtual object GetData() => null!;
    }

    public sealed class ContentApiResult<T> : IApiResult
    {
        public T Data { get; set; }

        public ContentApiResult(T data)
        {
            Data = data;
        }
        public object GetData() => Data!;
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