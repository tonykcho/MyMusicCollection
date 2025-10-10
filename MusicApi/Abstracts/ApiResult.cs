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

    public sealed class ValidationErrorApiResult : IApiResult
    {
        public IDictionary<string, string[]> Data { get; set; }

        public ValidationErrorApiResult(IDictionary<string, string[]> data)
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
        public string Message { get; set; } = string.Empty;
        public BadRequestApiResult(string message)
        {
            Message = message;
        }
    }

    public sealed class NotFoundApiResult : IApiResult
    {
    }

    public sealed class TaskCancelledApiResult : IApiResult
    {
    }
}