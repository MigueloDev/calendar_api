FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install -g nodemon
RUN npm install
COPY . .
EXPOSE 4000
CMD ["nodemon", "src/index.js"]