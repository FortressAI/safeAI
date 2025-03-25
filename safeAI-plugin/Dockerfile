# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set environment variables
ENV PUBLIC_URL=/
ENV NODE_ENV=production

# Build the app
RUN npm run build

# Explicitly copy manifest.json to build directory
COPY public/manifest.json build/

# Production stage
FROM nginx:stable-alpine

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Verify manifest.json exists in nginx directory
RUN ls -la /usr/share/nginx/html/manifest.json

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 