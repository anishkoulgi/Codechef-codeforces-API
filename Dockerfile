# Base Stage

FROM node:12-alpine AS base

WORKDIR /usr/app

#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM base AS builder

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Remove dev dependencies
RUN npm prune --production 

#
# Production stage.
# This state compile get back the JavaScript code and the node modules from builder stage
#
FROM base AS release
ENV NODE_ENV=production

## We just need the build to execute the command
COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/build ./build

EXPOSE 3000
CMD node build/src/App.js