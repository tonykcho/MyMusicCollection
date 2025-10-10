using System.Reflection;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using MusicApi.Abstracts;
using MusicApi.DbContexts;
using MusicApi.Endpoints;
using MusicApi.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
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