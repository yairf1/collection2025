FROM node:16.14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000 80
CMD [ "node", "app.js" ]