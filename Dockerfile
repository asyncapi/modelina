    FROM eclipse-temurin:17-jdk-jammy

# Install updates
RUN apt-get update -yq \
    && apt-get install -yq curl

# Install C++ compiler
RUN apt-get install -yq build-essential

# Install nodejs
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -yq nodejs

# Install golang
RUN curl -fsSL https://golang.org/dl/go1.16.8.linux-amd64.tar.gz | tar -C /usr/local -xz
ENV PATH="${PATH}:/usr/local/go/bin"

# Install dotnet SDK
RUN apt install apt-transport-https dirmngr gnupg ca-certificates -yq  \
    && apt update -yq  \
    && apt install mono-devel -yq

# Install rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Install Python
RUN apt-get install -yq python3 python-is-python3

# Install Kotlin
RUN apt install -yq wget unzip  \
    && cd /usr/lib \
    && wget -q https://github.com/JetBrains/kotlin/releases/download/v1.8.0/kotlin-compiler-1.8.0.zip \
    && unzip -qq kotlin-compiler-*.zip

ENV PATH $PATH:/usr/lib/kotlinc/bin

# Install PHP
RUN apt-get update -yq \
    && apt-get install -yq php php-cli php-common php-xml php-mbstring php-curl

# Setup library
RUN apt-get install -yq chromium-browser