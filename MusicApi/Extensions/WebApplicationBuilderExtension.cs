using System.Reflection;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using MusicApi.Abstracts;
using MusicApi.DbContexts;
using MusicApi.Services;
using Serilog;

namespace MusicApi.Extensions;

public static class WebApplicationBuilderExtension
{
    public static WebApplicationBuilder AddLogging(this WebApplicationBuilder builder)
    {
        LoggerConfiguration configuration = new LoggerConfiguration();

        configuration
            .MinimumLevel.Information()
            .WriteTo.Console();

        configuration
            .WriteTo.Logger(c => c
                .Filter.ByIncludingOnly(e => e.Level == Serilog.Events.LogEventLevel.Error || e.Level == Serilog.Events.LogEventLevel.Fatal)
                .WriteTo.File("logs/error-.log", rollingInterval: RollingInterval.Day, retainedFileCountLimit: 7));

        Log.Logger = configuration.CreateLogger();

        builder.Host.UseSerilog();

        return builder;
    }

    public static WebApplicationBuilder AddValidators(this WebApplicationBuilder builder)
    {
        builder.Services.Configure<ApiBehaviorOptions>(options =>
        {
            options.SuppressModelStateInvalidFilter = true;
        });
        builder.Services.AddValidatorsFromAssembly(Assembly.Load(typeof(Program).Assembly.GetName()));

        return builder;
    }

    public static WebApplicationBuilder AddRequestHandlers(this WebApplicationBuilder builder)
    {
        foreach (var type in Assembly.Load(typeof(Program).Assembly.GetName()).GetTypes().Where(x => x.Name.EndsWith("Handler") && x.IsAbstract == false && x.IsInterface == false))
        {
            foreach (var iface in type.GetInterfaces().Where(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(IApiRequestHandler<>)))
            {
                builder.Services.AddScoped(iface, type);
            }
        }

        return builder;
    }

    public static WebApplicationBuilder AddServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddScoped<ApiRequestPipeline>();
        builder.Services.AddSingleton<ImageStorageService>();
        builder.Services.AddDbContext<AppDbContext>();

        return builder;
    }

    public static WebApplicationBuilder AddCors(this WebApplicationBuilder builder)
    {
        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy.AllowAnyOrigin()
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });

        return builder;
    }
}