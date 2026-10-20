FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine AS runtime

ARG APP_VERSION=development

LABEL org.opencontainers.image.source="https://github.com/figueroamatias/ingsoft3"
LABEL org.opencontainers.image.revision=$APP_VERSION

ENV APP_VERSION=$APP_VERSION
ENV BACKEND_URL=http://backend:3000
ENV NGINX_ENVSUBST_FILTER="^(APP_VERSION|BACKEND_URL)$"

COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
