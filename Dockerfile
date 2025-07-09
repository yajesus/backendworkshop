# --- Production stage ---
    FROM node:20-alpine

    RUN apk add --no-cache dumb-init
    RUN addgroup -g 1001 -S nodejs
    RUN adduser -S nodejs -u 1001
    
    WORKDIR /app
    
    # ✅ Copy only what's needed from builder
    COPY --from=builder /app/build ./build
    COPY --from=builder /app/prisma ./prisma
    COPY --from=builder /app/node_modules ./node_modules
    
    # ✅ Optional: Prisma generated client
    COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
    
    RUN chown -R nodejs:nodejs /app
    USER nodejs
    
    EXPOSE 3000
    
    ENTRYPOINT ["dumb-init", "--"]
    CMD ["npm", "start"]
    