ARG NODE_VERSION=24.22.0-alpine
ARG NGINX_VERSION=alpine3.24


FROM node:${NODE_VERSION} AS builder

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable

COPY . .
RUN yarn build

FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runner

ENV JAMS_BACKEND_URL=http://host.docker.internal:8080

COPY nginx.conf /etc/nginx/nginx.conf
COPY jams.conf.template /etc/nginx/templates/jams.conf.template
COPY --chown=nginx:nginx --from=builder /app/dist /usr/share/nginx/html

USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
