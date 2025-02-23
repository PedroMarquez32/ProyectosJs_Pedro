FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Instalar todas las dependencias, incluyendo devDependencies
RUN npm install --include=dev

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"] 