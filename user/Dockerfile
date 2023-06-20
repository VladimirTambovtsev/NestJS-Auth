# Base image
# ARG NEXUS_REGISTRY_PROXY
# ARG NEXUS_REGISTRY
# FROM $NEXUS_REGISTRY_PROXY/node:16.15.1
FROM node:16.15.1

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY ./ ./

# Install app dependencies
RUN yarn install

# Bundle app source
COPY . .

ENV NODE_ENV production


# Creates a "dist" folder with the production build
# RUN yarn start:dev


EXPOSE 3002

# # Start the server using the production build
CMD [ "yarn", "start:dev" ]
