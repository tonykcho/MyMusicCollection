using FluentValidation;
using MusicApi.Diagnostics;

namespace MusicApi.Abstracts;

public class ApiRequestPipeline(IServiceProvider serviceProvider)
{
    public async Task<IApiResult> RunPipeLineAsync<TRequest>(TRequest request, CancellationToken cancellationToken) where TRequest : IApiRequest
    {
        if (cancellationToken.IsCancellationRequested)
        {
            return new TaskCancelledApiResult();
        }

        // Fluent Validation
        var validator = serviceProvider.GetService<IValidator<TRequest>>();

        if (validator is not null)
        {
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (validationResult.IsValid == false)
            {
                IDictionary<string, string[]> errors = validationResult.ToDictionary();

                return new ValidationErrorApiResult(errors);
            }
        }

        if (request is null)
        {
            return new BadRequestApiResult("Request body is null.");
        }

        var handler = serviceProvider.GetRequiredService<IApiRequestHandler<TRequest>>();

        using var activity = MusicApiInstrumentation.ActivitySource.StartActivity(handler.GetType().Name);
        activity?.SetTag("request.type", typeof(TRequest).Name);

        try
        {
            var result = await handler.HandleAsync(request, cancellationToken);
            return result;
        }
        catch (Exception ex)
        {
            activity?.SetStatus(System.Diagnostics.ActivityStatusCode.Error, ex.Message);
            activity?.AddException(ex);

            throw;
        }
    }
}