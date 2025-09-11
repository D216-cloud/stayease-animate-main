### Backend Environment Variables

Set in your hosting provider or `.env` (do not commit secrets):

- MONGO_URI: MongoDB connection string
- JWT_SECRET: Strong random secret
- NODE_ENV: production
- PORT: 5000 (or host-assigned)
- FRONTEND_URL: Single allowed frontend origin
- FRONTEND_URLS: Optional comma-separated additional origins
- CLOUDINARY_CLOUD_NAME: Cloudinary cloud name
- CLOUDINARY_API_KEY: Cloudinary API key
- CLOUDINARY_API_SECRET: Cloudinary API secret

#### Example
```
MONGO_URI=mongodb+srv://user:pass@cluster/db
JWT_SECRET=change_me_to_a_long_random_string
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://app.yourdomain.com
FRONTEND_URLS=https://www.yourdomain.com,https://staging.yourdomain.com
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```
