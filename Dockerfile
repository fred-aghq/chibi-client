FROM node:23-alpine3.21
WORKDIR /home/node/app
ADD . /home/node/app
RUN npm install && npm run build
ENTRYPOINT [ "npm", "run", "dev" ]
EXPOSE 8888