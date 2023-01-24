FROM openjdk:16.0.1-jdk-slim-buster

# Install updates
RUN apt-get update -yq \
    && apt-get install -yq curl

# Install nodejs
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -yq nodejs 

# Install golang
RUN curl -fsSL https://golang.org/dl/go1.16.8.linux-amd64.tar.gz | tar -C /usr/local -xz
ENV PATH="${PATH}:/usr/local/go/bin"

# Install dotnet SDK
RUN apt install apt-transport-https dirmngr gnupg ca-certificates -yq  \
    && apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF \
    && echo "deb https://download.mono-project.com/repo/debian stable-buster main" | tee /etc/apt/sources.list.d/mono-official-stable.list \
    && apt update -yq  \
    && apt install mono-devel -yq 

# Setup library 
COPY package-lock.json .
RUN npm install
COPY . .