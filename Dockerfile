# --- Builder stage ---
    FROM node:20-alpine AS builder

    # Set working directory
    WORKDIR /app
    
    # Copy package files and Prisma schema
    COPY package*.json ./
    COPY prisma ./prisma
    
    # Install all dependencies including devDependencies
    RUN npm install
    
    # Generate Prisma client
    RUN npx prisma generate
    
    # Copy rest of the app code
    COPY . .
    
    # Build the app (assumes TypeScript)
    RUN npm run build
    
    
    # --- Production stage ---
    FROM node:20-alpine
    
    # Install dumb-init for better signal handling
    RUN apk add --no-cache dumb-init
    
    # Add non-root user
    RUN addgroup -g 1001 -S nodejs \
     && adduser -S nodejs -u 1001
    
    # Set working directory
    WORKDIR /app
    
    # ✅ Copy package.json (for npm start)
    COPY --from=builder /app/package*.json ./
    
    # ✅ Copy built app, node_modules, Prisma client
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/prisma ./prisma
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
    
    # Fix ownership
    RUN chown -R nodejs:nodejs /app
    USER nodejs
    
    # Port
    EXPOSE 3000
    
    # Use dumb-init to avoid zombie processes
    ENTRYPOINT ["dumb-init", "--"]
    
    # ✅ Starts built TypeScript app
    CMD ["node", "dist/index.js"]
    