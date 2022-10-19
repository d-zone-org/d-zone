FROM lsiobase/alpine:3.16

LABEL maintainer="Peppershade <admin@peppershade.nl>"
LABEL description="Dockerfile to build an image of D-Zone which is to be accessed with a reverse proxy like NGINX"
LABEL build="0.2.4"

WORKDIR /app/d-zone

# Clone project files
RUN apk add --no-cache git npm nginx rsync
RUN mkdir -p /app/d-zone
RUN git clone -b master https://github.com/d-zone-org/d-zone.git /app/d-zone

# Create workspace
RUN cd /app/d-zone
COPY root/ /

# Patch source to work with Docker and Websocket
RUN git apply /app/d-zone/docker.patch

# Compile the app
RUN npm install --no-optional
RUN npm run-script build
RUN apk del --purge git

# Remove files we don't need
RUN rm -rf /root/.cache /tmp/*
RUN rm /app/d-zone/socket-config.json
RUN rm /etc/nginx/http.d/default.conf
RUN rm /app/d-zone/docker.patch

# Communicate ports and volumes to be used
EXPOSE 80
VOLUME /config
