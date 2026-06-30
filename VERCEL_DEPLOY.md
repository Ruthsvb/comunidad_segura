# Deploy Frontend a Vercel

## Status Actual
- Proyecto ya deployado: `https://comunidad-seguraproject.vercel.app`
- Vite dev server corre en `localhost:3001`

## Actualizar Environment Variables

Cuando backend esté en Render:

1. **Vercel Dashboard**
   - Go to: https://vercel.com/projects/comunidad-seguraproyecto
   - Settings → Environment Variables

2. **Agregar Variable**
   - Key: `VITE_API_URL`
   - Value: `https://[tu-backend-url].onrender.com`
   - Environments: Production, Preview, Development

3. **Redeploy**
   - Deployments → redeploy latest commit
   - Or push nuevo commit a main

## Verificar

```bash
# En browser, network tab verá requests a:
# https://[backend-url]/api/tickets
# https://[backend-url]/api/dashboard
# etc
```

## Local Development

Para dev local:
```bash
# Terminal 1: Backend
cd comunidad_segura_backend
npm start

# Terminal 2: Frontend
cd comunidad_segura
npm run dev
# Abre http://localhost:3001
```

.env.local tiene `VITE_API_URL=http://localhost:3000` para local testing.
