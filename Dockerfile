FROM openjdk:16.0.1-jdk-slim-buster
RUN apt-get update -yq \
    && apt-get install -yq curl \
    && curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -yq nodejs

COPY package-lock.json .
RUN npm install
COPY . .