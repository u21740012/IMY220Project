FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY .babelrc ./
COPY webpack.config.js ./
COPY postcss.config.js tailwind.config.js ./
COPY frontend ./frontend
COPY backend  ./backend

#Build backend 

RUN npx babel backend/server.js -d backend/dist \
 && mkdir -p backend/dist/routes backend/dist/models \
 && cp -r backend/routes/.  backend/dist/routes/ \
 && cp -r backend/models/.  backend/dist/models/

#Build frontend 
RUN npm run build:client || npx webpack --config webpack.config.js


RUN set -eux; \
    mkdir -p /app/frontend-build; \
    if [ -d /app/frontend/dist ]; then \
        cp -r /app/frontend/dist/* /app/frontend-build/; \
    elif [ -d /app/dist ]; then \
        cp -r /app/dist/* /app/frontend-build/; \
    else \
        [ -f /app/index.html ] && cp -r /app/index.html /app/frontend-build/ || true; \
        ls -1 /app | grep -E 'bundle.*\.js$' && cp -r /app/bundle*.js /app/frontend-build/ || true; \
    fi

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=1337

COPY backend/package.json backend/package-lock.json* ./backend/
RUN cd backend && (npm ci --omit=dev || npm install --omit=dev)

COPY --from=builder /app/backend/dist ./backend/dist
RUN mkdir -p ./backend/dist/public
COPY --from=builder /app/frontend-build ./backend/dist/public

RUN mkdir -p ./backend/uploads && chown -R node:node ./backend/uploads

USER node
EXPOSE 1337
CMD ["node", "backend/dist/server.js"]
