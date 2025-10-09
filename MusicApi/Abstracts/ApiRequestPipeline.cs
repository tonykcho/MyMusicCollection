namespace MusicApi.Abstracts;

public class ApiRequestPipeline(IServiceProvider serviceProvider)
{
    public async Task<IApiResult> RunPipeLineAsync<TRequest>(TRequest request, CancellationToken cancellationToken) where TRequest : IApiRequest
    {
        if (cancellationToken.IsCancellationRequested)
        {
            return new TaskCancelledApiResult();
        }

        if (request is null)
        {
            return new BadRequestApiResult();
        }

        var handler = serviceProvider.GetRequiredService<IApiRequestHandler<TRequest>>();

        var result = await handler.HandleAsync(request, cancellationToken);

        return result;
    }
}