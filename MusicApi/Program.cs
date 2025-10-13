using MusicApi.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddAntiforgery();

builder
    .AddLogging()
    .AddServices()
    .AddRequestHandlers()
    .AddValidators()
    .AddCors();

var app = builder.Build();

app.MapApiEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAntiforgery();

app.Run();