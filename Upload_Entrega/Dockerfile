# Use Node.js official image
FROM node:18-alpine

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache python3 make g++

# Crear un usuario no root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY . .

# Crear directorios y establecer permisos
RUN mkdir -p uploads recycle && \
    chown -R appuser:appgroup /usr/src/app && \
    chmod -R 755 /usr/src/app && \
    chmod -R 777 /usr/src/app/uploads && \
    chmod -R 777 /usr/src/app/recycle

# Cambiar al usuario no root
USER appuser

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
