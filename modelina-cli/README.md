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

# Table of contents

<!-- toc -->

- [Installation](#installation)
  * [MacOS](#macos)
  * [Windows](#windows)
  * [Linux](#linux)
  * [Others](#others)
- [Usage](#usage)
- [Commands](#commands)
  * [`modelina config`](#modelina-config)
  * [`modelina config context`](#modelina-config-context)
  * [`modelina config context add CONTEXT-NAME SPEC-FILE-PATH`](#modelina-config-context-add-context-name-spec-file-path)
  * [`modelina config context current`](#modelina-config-context-current)
  * [`modelina config context edit CONTEXT-NAME NEW-SPEC-FILE-PATH`](#modelina-config-context-edit-context-name-new-spec-file-path)
  * [`modelina config context init [CONTEXT-FILE-PATH]`](#modelina-config-context-init-context-file-path)
  * [`modelina config context list`](#modelina-config-context-list)
  * [`modelina config context remove CONTEXT-NAME`](#modelina-config-context-remove-context-name)
  * [`modelina config context use CONTEXT-NAME`](#modelina-config-context-use-context-name)
  * [`modelina generate LANGUAGE FILE`](#modelina-generate-language-file)

<!-- tocstop -->

# Installation
Here are all the ways you can install and run the Modelina CLI.

## MacOS

<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table  align="center" style="width: 100%;">
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

## Windows

<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table align="center" style="width: 100%;">
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


## Linux
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table align="center" style="width: 100%;">
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

## Others
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table align="center" style="width: 100%;">
  <tr>
    <td>
<b>NPM</b>

```typescript
npm install -g @asyncapi/modelina-cli
```
</td>
  </tr>
</table>

# Usage
<!-- usage -->
```sh-session
$ npm install -g @asyncapi/modelina-cli
$ modelina COMMAND
running command...
$ modelina (--version)
@asyncapi/modelina-cli/4.0.0-next.29 linux-x64 node-v18.20.2
$ modelina --help [COMMAND]
USAGE
  $ modelina COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`modelina config`](#modelina-config)
* [`modelina config context`](#modelina-config-context)
* [`modelina config context add CONTEXT-NAME SPEC-FILE-PATH`](#modelina-config-context-add-context-name-spec-file-path)
* [`modelina config context current`](#modelina-config-context-current)
* [`modelina config context edit CONTEXT-NAME NEW-SPEC-FILE-PATH`](#modelina-config-context-edit-context-name-new-spec-file-path)
* [`modelina config context init [CONTEXT-FILE-PATH]`](#modelina-config-context-init-context-file-path)
* [`modelina config context list`](#modelina-config-context-list)
* [`modelina config context remove CONTEXT-NAME`](#modelina-config-context-remove-context-name)
* [`modelina config context use CONTEXT-NAME`](#modelina-config-context-use-context-name)
* [`modelina generate LANGUAGE FILE`](#modelina-generate-language-file)

## `modelina config`

CLI config settings

```
USAGE
  $ modelina config

DESCRIPTION
  CLI config settings
```

_See code: [src/commands/config/index.ts](https://github.com/asyncapi/modelina/blob/v4.0.0-next.29/modelina-cli/src/commands/config/index.ts)_

## `modelina config context`

Manage short aliases for full paths to inputs

```
USAGE
  $ modelina config context

DESCRIPTION
  Manage short aliases for full paths to inputs
```

_See code: [src/commands/config/context/index.ts](https://github.com/asyncapi/modelina/blob/v4.0.0-next.29/modelina-cli/src/commands/config/context/index.ts)_

## `modelina config context add CONTEXT-NAME SPEC-FILE-PATH`

Add a context to the store

```
USAGE
  $ modelina config context add CONTEXT-NAME SPEC-FILE-PATH [-h] [-s]

ARGUMENTS
  CONTEXT-NAME    context name
  SPEC-FILE-PATH  file path of the spec file

FLAGS
  -h, --help         Show CLI help.
  -s, --set-current  Set context being added as the current context

DESCRIPTION
  Add a context to the store
```

_See code: [src/commands/config/context/add.ts](https://github.com/asyncapi/modelina/blob/v4.0.0-next.29/modelina-cli/src/commands/config/context/add.ts)_

## `modelina config context current`

Shows the current context that is being used

```
USAGE
  $ modelina config context current [-h]

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  Shows the current context that is being used
```

_See code: [src/commands/config/context/current.ts](https://github.com/asyncapi/modelina/blob/v4.0.0-next.29/modelina-cli/src/commands/config/context/current.ts)_

## `modelina config context edit CONTEXT-NAME NEW-SPEC-FILE-PATH`

Edit a context in the store

```
USAGE
  $ modelina config context edit CONTEXT-NAME NEW-SPEC-FILE-PATH [-h]

ARGUMENTS
  CONTEXT-NAME        context name
  NEW-SPEC-FILE-PATH  file path of the spec file

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  Edit a context in the store
```

_See code: [src/commands/config/context/edit.ts](https://github.com/asyncapi/modelina/blob/v4.0.0-next.29/modelina-cli/src/commands/config/context/edit.ts)_

## `modelina config context init [CONTEXT-FILE-PATH]`

Initialize context

```
USAGE
  $ modelina config context init [CONTEXT-FILE-PATH] [-h]

ARGUMENTS
  CONTEXT-FILE-PATH  Specify directory in which context file should be created:
                     - current directory          : modelina config context init . (default)
                     - root of current repository : modelina config context init ./
                     - user's home directory      : modelina config context init ~

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  Initialize context
```

_See code: [src/commands/config/context/init.ts](https://github.com/asyncapi/modelina/blob/v4.0.0-next.29/modelina-cli/src/commands/config/context/init.ts)_

## `modelina config context list`

List all the stored contexts in the store

```
USAGE
  $ modelina config context list [-h]

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  List all the stored contexts in the store
```

_See code: [src/commands/config/context/list.ts](https://github.com/asyncapi/modelina/blob/v4.0.0-next.29/modelina-cli/src/commands/config/context/list.ts)_

## `modelina config context remove CONTEXT-NAME`

Delete a context from the store

```
USAGE
  $ modelina config context remove CONTEXT-NAME [-h]

ARGUMENTS
  CONTEXT-NAME  Name of the context to delete

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  Delete a context from the store
```

_See code: [src/commands/config/context/remove.ts](https://github.com/asyncapi/modelina/blob/v4.0.0-next.29/modelina-cli/src/commands/config/context/remove.ts)_

## `modelina config context use CONTEXT-NAME`

Set a context as current

```
USAGE
  $ modelina config context use CONTEXT-NAME [-h]

ARGUMENTS
  CONTEXT-NAME  name of the saved context

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  Set a context as current
```

_See code: [src/commands/config/context/use.ts](https://github.com/asyncapi/modelina/blob/v4.0.0-next.29/modelina-cli/src/commands/config/context/use.ts)_

## `modelina generate LANGUAGE FILE`

Generates typed models

```
USAGE
  $ modelina generate LANGUAGE FILE [-h] [-o <value>] [--tsModelType class|interface] [--tsEnumType
    enum|union] [--tsModuleSystem ESM|CJS] [--tsIncludeComments] [--tsExportType default|named] [--tsJsonBinPack]
    [--tsMarshalling] [--tsExampleInstance] [--packageName <value>] [--javaIncludeComments] [--javaJackson]
    [--javaConstraints] [--namespace <value>] [--csharpAutoImplement] [--csharpNewtonsoft] [--csharpArrayType
    Array|List] [--csharpHashcode] [--csharpEqual] [--csharpSystemJson]

ARGUMENTS
  LANGUAGE  (typescript|csharp|golang|java|javascript|dart|python|rust|kotlin|php|cplusplus|scala) The language you want
            the typed models generated for.
  FILE      Path or URL to the AsyncAPI document, or context-name

FLAGS
  -h, --help                      Show CLI help.
  -o, --output=<value>            The output directory where the models should be written to. Omitting this flag will
                                  write the models to `stdout`.
      --csharpArrayType=<option>  [default: Array] C# specific, define which type of array needs to be generated.
                                  <options: Array|List>
      --csharpAutoImplement       C# specific, define whether to generate auto-implemented properties or not.
      --csharpEqual               C# specific, generate the models with the Equal method overwritten
      --csharpHashcode            C# specific, generate the models with the GetHashCode method overwritten
      --csharpNewtonsoft          C# specific, generate the models with newtonsoft serialization support
      --csharpSystemJson          C# specific, generate the models with System.Text.Json serialization support
      --javaConstraints           Java specific, generate the models with constraints
      --javaIncludeComments       Java specific, if enabled add comments while generating models.
      --javaJackson               Java specific, generate the models with Jackson serialization support
      --namespace=<value>         C#, C++ and PHP specific, define the namespace to use for the generated models. This
                                  is required when language is `csharp`,`c++` or `php`.
      --packageName=<value>       Go, Java and Kotlin specific, define the package to use for the generated models. This
                                  is required when language is `go`, `java` or `kotlin`.
      --tsEnumType=<option>       [default: enum] TypeScript specific, define which type of enums needs to be generated.
                                  <options: enum|union>
      --tsExampleInstance         Typescript specific, generate example of the model.
      --tsExportType=<option>     [default: default] TypeScript specific, define which type of export needs to be
                                  generated.
                                  <options: default|named>
      --tsIncludeComments         TypeScript specific, if enabled add comments while generating models.
      --tsJsonBinPack             TypeScript specific, define basic support for serializing to and from binary with
                                  jsonbinpack.
      --tsMarshalling             TypeScript specific, generate the models with marshalling functions.
      --tsModelType=<option>      [default: class] TypeScript specific, define which type of model needs to be
                                  generated.
                                  <options: class|interface>
      --tsModuleSystem=<option>   [default: ESM] TypeScript specific, define the module system to be used.
                                  <options: ESM|CJS>

DESCRIPTION
  Generates typed models
```

_See code: [src/commands/generate.ts](https://github.com/asyncapi/modelina/blob/v4.0.0-next.29/modelina-cli/src/commands/generate.ts)_
<!-- commandsstop -->
