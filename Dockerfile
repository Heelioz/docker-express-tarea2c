FROM node:21-slim

COPY app.js /opt/docker-express-tarea-nube/app.js
COPY package.json /opt/docker-express-tarea-nube/package.json
COPY package-lock.json /opt/docker-express-tarea-nube/package-lock.json

RUN sh -c 'cd /opt/docker-express-tarea-nube; npm i' \
    && groupadd -g 5000 -r expuser \
    && useradd -r -M -u 5000 -g expuser expuser \
    && chown -R expuser:expuser /opt/docker-express-tarea-nube

WORKDIR /opt/docker-express-tarea-nube

EXPOSE 3000

ENTRYPOINT ["node", "/opt/docker-express-tarea-nube/app.js"]
