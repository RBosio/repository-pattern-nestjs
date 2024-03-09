FROM node:18-alpine3.18 AS base

ENV DIR /app
WORKDIR ${DIR}


FROM base AS dev

ENV NODE_ENV=development
COPY package*.json ${DIR}

RUN npm install

COPY tsconfig*.json ${DIR}
COPY src ${DIR}/src

EXPOSE 3000
CMD [ "npm", "run", "start:dev" ]