# Deployment Guide for Render

## Prerequisites

1. A Render account
2. A PostgreSQL database (you can use Render's PostgreSQL service)
3. Your application code pushed to a Git repository

## Environment Variables Required

Set these environment variables in your Render service:

- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A secure random string for JWT token signing
- `CORS_ORIGIN`: Your frontend URL (e.g., `https://your-frontend.vercel.app`)
- `NODE_ENV`: Set to `production`
- `PORT`: Render will set this automatically

## Deployment Steps

1. **Connect your repository to Render:**
   - Go to your Render dashboard
   - Click "New +" and select "Web Service"
   - Connect your Git repository
   - Choose the repository containing this code

2. **Configure the service:**
   - **Name**: workshop-backend (or your preferred name)
   - **Environment**: Docker
   - **Region**: Choose closest to your users
   - **Branch**: main (or your default branch)
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

3. **Set Environment Variables:**
   - Add all required environment variables listed above
   - Make sure `DATABASE_URL` points to your PostgreSQL database

4. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

## Health Check

The application includes a health check endpoint at `/health` that returns:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## Database Setup

1. **Create a PostgreSQL database on Render:**
   - Go to your Render dashboard
   - Click "New +" and select "PostgreSQL"
   - Choose your preferred plan and region
   - Copy the connection string

2. **Run database migrations:**
   - The application will automatically run `prisma db push` on startup
   - This will create all necessary tables

## Troubleshooting

- **Build fails**: Check that all dependencies are in `package.json`
- **Database connection fails**: Verify `DATABASE_URL` is correct
- **Application crashes**: Check logs in Render dashboard
- **Health check fails**: Ensure the `/health` endpoint is accessible

## Security Notes

- The Dockerfile runs the application as a non-root user
- Environment variables are properly handled
- CORS is configured for production use
- JWT tokens are used for authentication 