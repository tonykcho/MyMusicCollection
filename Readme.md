# Run dev

Use vscode debug, it will set up services with compose.dev.yaml

# Run prod without image

Use compose.yaml to create all services.

```
docker compose --env-file .env -f compose.yaml up -d
```

# Run prod with image

Use compose.prod.yaml to create all servicse

```
docker compose --env-file .env -f compose.prod.yaml up -d
```