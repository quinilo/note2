FROM node:18 AS build

WORKDIR /app

COPY package*.json /app/

RUN npm ci

COPY . /app/
RUN npm run build
RUN npm prune --production

FROM node:18 AS run

ENV NODE_ENV=production

EXPOSE 3000

WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
RUN ulimit -c unlimited
ENTRYPOINT ["node", "build"]