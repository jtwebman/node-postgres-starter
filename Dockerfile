FROM node:20 as build
WORKDIR /usr/src/app
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci
COPY src /usr/src/app/src
RUN npm run build

FROM node:20 as build-prod
WORKDIR /usr/src/app
COPY package.json /usr/src/app/package.json 
COPY package-lock.json /usr/src/app/package-lock.json
RUN npm ci --production

FROM node:20-slim as production
RUN apt update && apt upgrade -y
WORKDIR /usr/src/app
COPY --from=build-prod /usr/src/app .
COPY --from=build /usr/src/app/dist dist
CMD ["node", "dist", "index.js"]