FROM node:lts-alpine
WORKDIR /usr/src/app
# the dependencies change less, so the install can be cached
COPY package.json package-lock.json ./
RUN npm install 
COPY src/ angular.json tsconfig.json tsconfig.app.json ./
# later can be set to a normal step or removed
ENTRYPOINT npm run ng test 
