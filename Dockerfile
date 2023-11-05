FROM node:20
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable
RUN pnpm install --frozen-lockfile --prod
COPY index.js ./
ENTRYPOINT ["node", "index.js"]
