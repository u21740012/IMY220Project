FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci || npm install

COPY webpack.config.js ./

COPY frontend ./frontend

COPY backend ./backend

COPY .babelrc ./

COPY postcss.config.js tailwind.config.js ./

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

ENV PORT=1337

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY --from=builder /app/backend/dist ./backend/dist

EXPOSE 1337
CMD ["node", "backend/dist/server.js"]
