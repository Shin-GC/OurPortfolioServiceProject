FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install --silent

COPY . /build .

EXPOSE 3000

CMD ["npx", "serve", "-s", "build"]