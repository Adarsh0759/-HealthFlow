
FROM node:22-alpine

# Remove package managers not required at runtime
RUN rm -rf \
    /usr/local/lib/node_modules/npm \
    /usr/local/lib/node_modules/corepack \
    /opt/yarn-v1.22.22 \
    /usr/local/bin/npm \
    /usr/local/bin/npx \
    /usr/local/bin/corepack \
    /usr/local/bin/yarn \
    /usr/local/bin/yarnpkg

WORKDIR /app

COPY package*.json ./
COPY src ./src

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Run as non-root
USER node

CMD ["node", "src/server.js"]
