# ./Mobile/Dockerfile

FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENV CI=true
ENV WEB_PORT=8081

EXPOSE 8081

CMD ["npm", "run", "web"]