using MusicApi.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder
    .AddLogging()
    .AddServices()
    .AddRequestHandlers()
    .AddValidators();

var app = builder.Build();

app.MapApiEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.Run();