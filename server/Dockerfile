ARG NODE_TAG=latest
ARG ENTRY_POINT=build/src/index.js
ARG EXPOSE_PORT=4000

FROM node:$NODE_TAG as build
WORKDIR /app

COPY . .

RUN npm set-script prepare "" && npm ci --prefer-offline --no-audit
RUN npm run build
RUN find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +

FROM node:$NODE_TAG

ARG ENTRY_POINT

ENV NODE_ENV=production
ENV NODE_ENTRY_POINT=$ENTRY_POINT

WORKDIR /app

COPY --from=build /app ./

RUN npm set-script prepare "" && npm ci --production

CMD node $NODE_ENTRY_POINT