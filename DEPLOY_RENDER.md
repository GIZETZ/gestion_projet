Deployment to Render (recommended for fullstack)

1. Push your repository to GitHub:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

2. On Render (https://dashboard.render.com):
 - Create a new Web Service
 - Connect your GitHub repo
 - For the service settings, use the defaults but verify:
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm run start:prod`
 - Add environment variables in the Render dashboard (do NOT commit secrets):
   - `DATABASE_URL` => your Neon connection string
   - `SESSION_SECRET` => a secure random string
   - `PORT` => 10000 (or leave default)

3. After first deploy, run migrations (if needed):
 - In Render shell or locally run:

```bash
npm run db:push
```

Notes:
 - Render will run on Linux; `start:prod` uses `NODE_ENV=production` prefix which is POSIX-compatible.
 - If you prefer to host frontend separately (Netlify), you can build static site and point `VITE_API_URL` to the Render service URL.
