FROM node:22
RUN corepack enable
RUN corepack prepare pnpm@9.14.2 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
VOLUME /config
ENV CONFIG_DIR=/config
ENV DOCKER_ENV=true
ENV NODE_ENV=production
ENV PORT=6014
COPY vite.config.ts vite.config.ts
COPY client client
COPY server server
COPY tsconfig.app.json tsconfig.app.json
COPY tsconfig.node.json tsconfig.node.json
COPY tsconfig.json tsconfig.json
RUN pnpm build
EXPOSE 6014
WORKDIR /config
ENTRYPOINT ["node", "--experimental-transform-types", "/app/server/server.ts"]
