# Deploying to Vercel (API-only)

This project is an Express API. These files have been added to run it on Vercel serverless functions:

- `api/index.js`: The serverless function entry that mounts the Express app.
- `vercel.json`: Rewrites all requests to the API handler so root (`/`) and `/api/*` work.
- `src/app.js`: Exports the Express `app` without `app.listen()` (serverless-friendly). Local dev starts from `app.js`.

## Verify after deploy
- Health check: open `https://<your-project>.vercel.app/api/health` — should return `{ ok: true }`.
- Root: open `https://<your-project>.vercel.app/` — should return a small JSON banner for the API.

## Vercel Project Settings
If this repository contains multiple folders, ensure you set the project root to `courses-pj` when importing on Vercel.

Build & Output Settings:
- Framework preset: "Other" (no framework build required)
- Install command: auto (or `npm i`)
- Build command: none
- Output directory: leave empty

No custom build is needed; Vercel will deploy the serverless function under `api/` using `@vercel/node`.

## Environment variables (required)
Set the following in Vercel → Project → Settings → Environment Variables:

- `DB_URL` → your MongoDB connection string (e.g., MongoDB Atlas)
- `JWT_SECRET` → a strong random secret
- `JWT_EXPIRES_IN` → e.g., `7d`
- `CORS_ORIGIN` → your frontend origin (e.g., `https://<your-frontend>.vercel.app`)
- `BREVO_SMTP_HOST` → usually `smtp-relay.brevo.com`
- `BREVO_SMTP_PORT` → `587`
- `BREVO_SMTP_USER` / `BREVO_SMTP_PASS` → your SMTP credentials
- `EMAIL_FROM` → no-reply@yourdomain.com
- `EMAIL_FROM_NAME` → platform display name
- `FRONTEND_URL` → the frontend base URL

`PORT` is managed by Vercel automatically; you do not need to set it.

## Local development
- `npm run run` → `node app.js`
- `npm start` → `nodemon app.js`

Local server uses `PORT` from `.env` (defaults to 3000).

## Troubleshooting
- If you still see `404 NOT_FOUND`, make sure:
  - The root directory of the Vercel project is `courses-pj` (the folder that contains `api/` and `vercel.json`).
  - `vercel.json` is committed and included in the deployment.
  - Try hitting `/api/health` directly.
  - Confirm environment variables are set and the database is reachable from Vercel.
- For CORS issues in the browser, ensure `CORS_ORIGIN` matches the exact frontend origin.
