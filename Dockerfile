FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json .

COPY package*.json .
RUN npm install

COPY tsconfig*.json ./
COPY vite.config.* ./


COPY . .

EXPOSE 5173

# RUN npm run dev
CMD ["npm","run","dev"]