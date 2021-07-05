FROM openjdk:16.0.1-jdk-slim-buster
RUN apt-get update -yq \
    && apt-get install -yq curl \
    && curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -yq nodejs \
    && curl -fsSL https://golang.org/dl/go1.16.5.linux-amd64.tar.gz | tar -C /usr/local -xz
ENV PATH="${PATH}:/usr/local/go/bin"

COPY package-lock.json .
RUN npm install
COPY . .