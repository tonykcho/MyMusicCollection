namespace MusicApi.Abstracts;

public interface IApiRequestHandler<TRequest> where TRequest : IApiRequest
{
    public Task<IApiResult> HandleAsync(TRequest request, CancellationToken cancellationToken);
}