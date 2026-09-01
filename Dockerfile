FROM debian:bookworm

# Install updates
RUN apt-get update -yq \
    && apt-get install -yq curl wget gnupg ca-certificates apt-transport-https

# Install Eclipse Temurin JDK 21 (eclipse-temurin no longer ships Debian
# Bookworm images, so install it via Adoptium's apt repo instead)
RUN mkdir -p /etc/apt/keyrings \
    && wget -O - https://packages.adoptium.net/artifactory/api/gpg/key/public | tee /etc/apt/keyrings/adoptium.asc \
    && echo "deb [signed-by=/etc/apt/keyrings/adoptium.asc] https://packages.adoptium.net/artifactory/deb bookworm main" | tee /etc/apt/sources.list.d/adoptium.list \
    && apt-get update -yq \
    && apt-get install -yq temurin-21-jdk

# Install C++ compiler
RUN apt-get install -yq build-essential

# Install nodejs
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -yq nodejs

# Install golang
ARG TARGETARCH
RUN curl -fsSL "https://go.dev/dl/go1.22.4.linux-${TARGETARCH}.tar.gz" | tar -C /usr/local -xz
ENV PATH="${PATH}:/usr/local/go/bin"

# Install dotnet SDK (mono-devel is available directly from Debian's own
# repos; the third-party mono-project apt repo no longer publishes bookworm
# packages)
RUN apt-get install -yq mono-devel

# Install rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Install Python
RUN apt-get install -yq python3

# Install Kotlin
RUN apt install -yq wget unzip  \
    && cd /usr/lib \
    && wget -q https://github.com/JetBrains/kotlin/releases/download/v1.8.0/kotlin-compiler-1.8.0.zip \
    && unzip -qq kotlin-compiler-*.zip

ENV PATH="${PATH}:/usr/lib/kotlinc/bin"

# Install PHP
RUN wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg \
    && echo "deb https://packages.sury.org/php/ bookworm main" > /etc/apt/sources.list.d/php.list \
    && apt-get update -yq \
    && apt-get install -y php8.2

# Setup library
RUN apt-get install -yq chromium
