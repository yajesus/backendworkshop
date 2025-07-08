# Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "run", "dev"]

# Install libssl1.1 if available, or fallback to libssl-dev if not
RUN apt-get update && \
    (apt-get install -y libssl1.1 || apt-get install -y libssl-dev)