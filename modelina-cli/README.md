[![AsyncAPI Modelina](../docs/img/readme-banner.png)](https://www.modelina.org)
[![License](https://img.shields.io/github/license/asyncapi/modelina)](https://github.com/asyncapi/modelina/blob/master/LICENSE)
[![Npm latest version](https://img.shields.io/npm/v/@asyncapi/modelina-cli)](https://www.npmjs.com/package/@asyncapi/modelina-cli)
![NPM Downloads](https://img.shields.io/npm/dm/modelina-cli?label=npm)
![homebrew downloads](https://img.shields.io/homebrew/installs/dm/modelina?label=Brew)
![Chocolatey Downloads](https://img.shields.io/chocolatey/dt/modelina?label=Chocolatey)
![GitHub Downloads (specific asset, all releases)](https://img.shields.io/github/downloads/asyncapi/modelina/modelina.x64.pkg?label=MacOS)
![GitHub Downloads (specific asset, all releases)](https://img.shields.io/github/downloads/asyncapi/modelina/modelina.arm64.pkg?label=MacOS)
![GitHub Downloads (specific asset, all releases)](https://img.shields.io/github/downloads/asyncapi/modelina/modelina.x86.exe?label=Win)
![GitHub Downloads (specific asset, all releases)](https://img.shields.io/github/downloads/asyncapi/modelina/modelina.x64.exe?label=Win)
![GitHub Downloads (specific asset, all releases)](https://img.shields.io/github/downloads/asyncapi/modelina/modelina.tar.gz?label=Linux)
![GitHub Downloads (specific asset, all releases)](https://img.shields.io/github/downloads/asyncapi/modelina/modelina.deb?label=Linux)


---

> NOTICE: If you are only working exclusively with AsyncAPI documents, using the [AsyncAPI CLI is the preferred way to interact with Modelina](https://github.com/asyncapi/cli#installation) as it has the exact same features.

Here are all the ways you can install and run the Modelina CLI. For a full list of commands, [checkout the usage documentation](./docs/usage.md).

<h2 align="center">MacOS</h2>
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td>
<b><a href="https://brew.sh/">Brew</a></b>

```
brew install modelina
```
</td>
  </tr>
  <tr>
    <td>
<b>MacOS x64</b>

Install it through dedicated `.pkg` file as a MacOS Application

```
# Download latest release
curl -OL https://github.com/asyncapi/modelina/releases/latest/download/modelina.x64.pkg
# Install it
sudo installer -pkg modelina.pkg -target /
```
</td>
  </tr>
  <tr>
    <td>
<b>MacOS arm64</b>

Install it through dedicated `.pkg` file as a MacOS Application for arm64
```
# Download latest release
curl -OL https://github.com/asyncapi/modelina/releases/latest/download/modelina.arm64.pkg
# Install it
sudo installer -pkg modelina.pkg -target /
```
</td>
  </tr>
</table>

<h2 align="center">Windows</h2>
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table style="width: 100%;">
  <tr>
    <td>
<b><a href="https://chocolatey.org/install">Chocolatey</a></b>

```
choco install modelina
```
</td>
  </tr>
  <tr>
    <td><b>Windows x64</b>

Manually download and run [`modelina.x64.exe`](https://github.com/asyncapi/modelina/releases/latest/download/modelina.x64.exe)
</td>
  </tr>
  <tr>
    <td>
<b>Windows x32</b>

Manually download and run the executable [`modelina.x86.exe`](https://github.com/asyncapi/modelina/releases/latest/download/modelina.x86.exe)
</td>
  </tr>
</table>


<h2 align="center">Linux</h2>
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td><b>Debian</b>

```
# Download
curl -OL https://github.com/asyncapi/modelina/releases/latest/download/modelina.deb

# Install
sudo apt install ./modelina.deb
```
</td>
  </tr>
  <tr>
    <td>
<b>Others</b>

```
# Download
curl -OL https://github.com/asyncapi/modelina/releases/latest/download/modelina.tar.gz
# Install
tar -xzf modelina.tar.gz
```

Remember to symlink the binaries `ln -s <absolute-path>/bin/modelina /user/local/bin/modelina` to access the CLI anywhere.
</td>
  </tr>
</table>

<h2 align="center">Other ways</h2>
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table style="width: 100%;">
  <tr>
    <td>
<b>NPM</b>

```typescript
npm install -g @asyncapi/modelina-cli
```
</td>
  </tr>
</table>
