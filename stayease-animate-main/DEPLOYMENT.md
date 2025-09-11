## StayEase Deployment Guide

### Backend (Node/Express)
Required environment variables:
- MONGO_URI: Your MongoDB connection string
- JWT_SECRET: Strong random string
- NODE_ENV: production
- PORT: 5000 (or host-assigned)
- FRONTEND_URL: e.g. https://app.yourdomain.com
- FRONTEND_URLS: optional, comma-separated list of allowed origins
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET: if using image uploads

Start:
1. npm ci
2. NODE_ENV=production node server.js (or use PM2/host runner)
3. Verify https://YOUR_BACKEND/api/health returns success

### Frontend (Vite/React)
Required environment variable:
- VITE_API_BASE_URL: Your backend origin (no trailing /api), e.g. https://api.yourdomain.com

Build & deploy:
1. npm ci
2. npm run build
3. Deploy `dist/` to static hosting

### Notes
- Frontend app automatically uses `${VITE_API_BASE_URL}/api` for all requests
- Auth routes use the same base; no hardcoded localhost
- CORS allows `FRONTEND_URL` and any origins from `FRONTEND_URLS`
