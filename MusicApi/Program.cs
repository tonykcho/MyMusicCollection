using System.Reflection;
using MusicApi.Abstracts;
using MusicApi.DbContexts;
using MusicApi.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddScoped<ApiRequestPipeline>();
builder.Services.AddDbContext<AppDbContext>();

foreach (var type in Assembly.Load(typeof(Program).Assembly.GetName()).GetTypes().Where(x => x.Name.EndsWith("Handler") && x.IsAbstract == false && x.IsInterface == false))
{
    foreach (var iface in type.GetInterfaces().Where(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(IApiRequestHandler<>)))
    {
        builder.Services.AddScoped(iface, type);
    }
}

var app = builder.Build();

app.MapMusicApiEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.Run();