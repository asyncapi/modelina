FROM eclipse-temurin:21-jdk-bookworm

# Install updates
RUN apt-get update -yq \
    && apt-get install -yq curl

# Install C++ compiler
RUN apt-get install -yq build-essential

# Install nodejs
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -yq nodejs

# Install golang
ARG TARGETARCH
RUN curl -fsSL "https://go.dev/dl/go1.22.4.linux-${TARGETARCH}.tar.gz" | tar -C /usr/local -xz
ENV PATH="${PATH}:/usr/local/go/bin"

# Install dotnet SDK
RUN apt install apt-transport-https dirmngr gnupg ca-certificates -yq  \
    && apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF \
    && echo "deb https://download.mono-project.com/repo/debian stable-bookworm main" | tee /etc/apt/sources.list.d/mono-official-stable.list \
    && apt update -yq  \
    && apt install mono-devel -yq

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
