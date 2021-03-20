FROM node:lts

WORKDIR /usr/app

COPY package*.json ./

RUN npm rebuild node-sass --force
RUN npm install -qy
RUN ls node_modules

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
