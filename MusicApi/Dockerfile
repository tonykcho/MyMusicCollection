FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5550

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["MusicApi.csproj", "MusicApi/"]
RUN dotnet restore "MusicApi/MusicApi.csproj"
COPY . ./MusicApi/
WORKDIR "/src/MusicApi"
RUN dotnet build "MusicApi.csproj" -c Release -o /app/build
RUN dotnet publish "MusicApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "MusicApi.dll"]