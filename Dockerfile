FROM node:20.12.2-slim as base

ARG PORT=3000

ENV PORT=$PORT

ENV NODE_ENV=production

WORKDIR /app

FROM base as build

COPY --link package.json package-lock.json ./

RUN npm ci --include=dev

COPY --link . .

RUN npm run build
RUN npm prune

FROM base

EXPOSE $PORT

COPY --from=build /app/.output /app/.output

CMD [ "node", ".output/server/index.mjs" ]