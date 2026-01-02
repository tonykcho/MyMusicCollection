using MusicApi.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddAntiforgery();

builder
    .AddLogging()
    .AddAuthentication()
    .AddServices()
    .AddOpentelemetry()
    .AddRequestHandlers()
    .AddValidators()
    .AddRateLimiter()
    .AddCors();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// app.UseHttpsRedirection();
app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.UseAntiforgery();
app.MapPrometheusScrapingEndpoint().AllowAnonymous();

app.MapApiEndpoints();

app.Run();