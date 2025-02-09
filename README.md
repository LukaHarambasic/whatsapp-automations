# Whatsapp Automations

> This project works, but it seems like WhatsApp has something in place to detect if the QR code was screenshotet and therefore doesn't accept it...

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
