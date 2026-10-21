FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:22-alpine AS runtime

ARG APP_VERSION=development

LABEL org.opencontainers.image.source="https://github.com/figueroamatias/ingsoft3"
LABEL org.opencontainers.image.revision=$APP_VERSION

ENV NODE_ENV=production
ENV APP_VERSION=$APP_VERSION
WORKDIR /app

COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node src ./src

USER node

EXPOSE 3000

CMD ["node", "--import", "./src/instrument.js", "src/server.js"]
