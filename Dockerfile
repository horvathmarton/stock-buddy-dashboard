FROM node:lts-alpine
WORKDIR /usr/src/app

# the dependencies change less, so the install can be cached
ADD angular.json  package.json  package-lock.json tsconfig.app.json  tsconfig.json ./
RUN npm install 

# remove comment if you dont want mount docker volumes
#COPY src/ angular.json tsconfig.json tsconfig.app.json ./
#ENTRYPOINT npm ci
