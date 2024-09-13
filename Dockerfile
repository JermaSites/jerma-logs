FROM node:20.16.0-slim AS base

ARG PORT=3000

ENV PORT=$PORT

ENV NODE_ENV=production

WORKDIR /usr/src/app

FROM base AS build

COPY --link package.json package-lock.json ./

RUN npm ci --include=dev

COPY --link . .

RUN npm run build

FROM base

EXPOSE $PORT

COPY --from=build /usr/src/app/.output /usr/src/app/.output

CMD [ "node", ".output/server/index.mjs" ]