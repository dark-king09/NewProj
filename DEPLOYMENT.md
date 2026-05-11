# Deployment Guide

This project has two deployable parts:

- `client`: Vite React frontend
- `server`: Express + MongoDB Atlas backend

Deploy the backend first, then deploy the frontend with the backend API URL.

## 1. Backend

Use a Node web service host such as Render, Railway, Fly.io, or a VPS. GitHub Pages and a static frontend-only Vercel project cannot run this Express server.

Recommended service settings:

```text
Root directory: .
Build command: npm install
Start command: npm run start --workspace server
```

Set these backend environment variables in the host dashboard:

```text
HOST=0.0.0.0
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain
CLIENT_URLS=https://your-frontend-domain
MONGODB_URI=your-atlas-uri
MONGODB_DATABASE=rural-education-platform
MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1
JWT_SECRET=your-long-random-secret
JWT_EXPIRES_IN=7d
ADMIN_SEED_NAME=Platform Admin
ADMIN_SEED_EMAIL=your-admin-email
ADMIN_SEED_PASSWORD=your-strong-admin-password
```

Admin uploads are stored in MongoDB GridFS, so you do not need a Render persistent disk for uploaded PDFs or images.

After deployment, verify:

```text
https://your-backend-domain/api/health
```

It should return a JSON response with `success: true`.

## 2. Frontend On Vercel

Create a Vercel project for the `client` directory.

Recommended Vercel settings:

```text
Framework preset: Vite
Root directory: client
Build command: npm run build
Output directory: dist
Install command: npm install
```

Set this frontend environment variable:

```text
VITE_API_URL=https://your-backend-domain/api
```

Deploy the frontend. After Vercel gives you the production URL, update the backend `CLIENT_URL` and `CLIENT_URLS` to that exact frontend URL, then redeploy or restart the backend.

## 3. Final Checks

Open these URLs after both services are live:

```text
https://your-backend-domain/api/health
https://your-frontend-domain/
https://your-frontend-domain/admin/login
```

If the frontend loads but admin/API actions fail, check `VITE_API_URL` first. If the backend logs show a CORS error, add the frontend URL to `CLIENT_URLS`. If the backend logs show `querySrv ECONNREFUSED`, keep `MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1` set on the backend host.
