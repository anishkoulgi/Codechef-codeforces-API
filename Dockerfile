#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM node AS builder

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

#
# Production stage.
# This state compile get back the JavaScript code from builder stage
# It will also install the production package only
#
FROM node

WORKDIR /usr/app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --only=production

## We just need the build to execute the command
COPY --from=builder /usr/app/build ./build

EXPOSE 3000
CMD node build/src/App.js