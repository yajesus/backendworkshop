# --- Builder stage ---
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    COPY package*.json ./
    COPY prisma ./prisma
    RUN npm install
    
    RUN npx prisma generate
    
    COPY . .
    RUN npm run build
    
    
    # --- Production stage ---
    FROM node:20-alpine
    
    RUN apk add --no-cache dumb-init
    RUN addgroup -g 1001 -S nodejs
    RUN adduser -S nodejs -u 1001
    
    WORKDIR /app
    
    COPY --from=builder /app/build ./build
    COPY --from=builder /app/prisma ./prisma
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
    
    RUN chown -R nodejs:nodejs /app
    USER nodejs
    
    EXPOSE 3000
    
    ENTRYPOINT ["dumb-init", "--"]
    CMD ["npm", "start"]
    