# Whatsapp Automations

## Auto reply

_Dev_

```
npm i
npm run autoreply
```

_Run_

```
// Build container
docker compose build

// Run container (optional)
docker compose run --rm whatsapp-automations

// Schedule container
0 1 * * * cd /path/to/your/project && docker compose run --rm whatsapp-automations
```
