# Deployment Checklist - Comunidad Segura

## BACKEND (Render.com)

- [ ] Crear GitHub repo: `github.com/Ruthsvb/comunidad-segura-backend`
- [ ] Push code: `git push -u origin main`
- [ ] Crear cuenta Render.com (o login)
- [ ] New Web Service → Connect GitHub
- [ ] Select repo `comunidad-segura-backend`
- [ ] Configure:
  - Root Directory: `.`
  - Build: `npm install`
  - Start: `node src/index.js`
  - Plan: Free
- [ ] Add Environment Variables:
  - DATABASE_URL: [Supabase connection string]
  - JWT_SECRET: `comunidad_segura_jwt_2026`
  - CORS_ORIGIN: `https://comunidad-seguraproject.vercel.app`
  - NODE_ENV: `production`
- [ ] Deploy
- [ ] Copy URL: `https://cs-backend-xxxx.onrender.com`
- [ ] Test health: `curl https://[url]/health`

## FRONTEND (Vercel)

- [ ] Go to: vercel.com/projects/comunidad-seguraproyecto
- [ ] Settings → Environment Variables
- [ ] Add `VITE_API_URL = https://[backend-url].onrender.com`
- [ ] Redeploy
- [ ] Update .env.local (if testing locally)

## VERIFICATION

- [ ] Backend health: `/health` responde `{"ok":true}`
- [ ] Frontend loads: `https://comunidad-seguraproject.vercel.app`
- [ ] Login works: auth requests go to `/api/auth/login`
- [ ] Dashboard loads: metrics appear
- [ ] Tickets load: `/api/tickets?unidad=101` returns data
- [ ] Chatbot works: websocket to n8n.cloud active

## POST-DEPLOYMENT

- [ ] Monitor Render logs for errors
- [ ] Check Vercel deployment status
- [ ] Test full flow: login → create ticket → view in list
- [ ] Verify chatbot still responding
