using System.Reflection;
using System.Threading.RateLimiting;
using FluentValidation;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using MusicApi.Abstracts;
using MusicApi.DbContexts;
using MusicApi.Services;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using OpenTelemetry.Metrics;
using Serilog;
using MusicApi.Diagnostics;
using OpenTelemetry.Logs;
using Serilog.Sinks.Grafana.Loki;

namespace MusicApi.Extensions;

public static class WebApplicationBuilderExtension
{
    public static WebApplicationBuilder AddLogging(this WebApplicationBuilder builder)
    {
        LoggerConfiguration configuration = new LoggerConfiguration();

        var labels = new List<LokiLabel>
        {
            new LokiLabel { Key = "app", Value = builder.Environment.ApplicationName },
            new LokiLabel { Key = "env", Value = builder.Environment.EnvironmentName }
        };

        configuration
            .MinimumLevel.Information()
            .WriteTo.Console();

        configuration
            .WriteTo.Logger(c => c
                .Filter.ByIncludingOnly(e => e.Level == Serilog.Events.LogEventLevel.Error || e.Level == Serilog.Events.LogEventLevel.Fatal)
                .WriteTo.File("logs/error-.log", rollingInterval: RollingInterval.Day, retainedFileCountLimit: 7));

        configuration
            .WriteTo.GrafanaLoki(builder.Configuration["OTLP:Loki"]!, labels);

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

    public static WebApplicationBuilder AddAuthentication(this WebApplicationBuilder builder)
    {
        builder.Services.AddAuthentication("BasicAuthentication")
            .AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("BasicAuthentication", null);

        builder.Services.AddAuthorization();

        return builder;
    }

    public static WebApplicationBuilder AddRateLimiter(this WebApplicationBuilder builder)
    {
        builder.Services.AddRateLimiter(options =>
        {
            options.AddFixedWindowLimiter("Fixed", config =>
            {
                config.PermitLimit = 20;
                config.Window = TimeSpan.FromSeconds(1);
                config.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                config.QueueLimit = 5;
            });

            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
        });

        return builder;
    }

    public static WebApplicationBuilder AddOpentelemetry(this WebApplicationBuilder builder)
    {
        builder.Services.AddOpenTelemetry()
            .ConfigureResource(resource =>
            {
                resource.AddService(builder.Environment.ApplicationName);
            })
            .WithMetrics(options =>
            {
                options
                    .AddProcessInstrumentation()
                    .AddRuntimeInstrumentation()
                    .AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation()
                    .AddSqlClientInstrumentation()
                    .AddMeter("MusicApi.Metrics")
                    .AddMeter("Microsoft.AspNetCore.Hosting")
                    .AddMeter("Microsoft.AspNetCore.Server.Kestrel")
                    .AddPrometheusExporter();
            })
            .WithTracing(tracerProviderBuilder =>
            {
                tracerProviderBuilder
                    .SetResourceBuilder(ResourceBuilder.CreateDefault().AddService(builder.Environment.ApplicationName))
                    .AddSource(MusicApiInstrumentation.ActivitySourceName)
                    .AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation()
                    .AddEntityFrameworkCoreInstrumentation()
                    .AddSqlClientInstrumentation()
                    .AddOtlpExporter(option =>
                    {
                        var endpoint = builder.Configuration["OTLP:Jaeger"];
                        if (string.IsNullOrEmpty(endpoint))
                        {
                            throw new InvalidOperationException("OTLP:Jaeger configuration is missing or empty.");
                        }
                        option.Endpoint = new Uri(endpoint);
                    });
            });

        return builder;
    }
}