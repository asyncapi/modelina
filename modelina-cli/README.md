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
* [Table of contents](#table-of-contents)
* [Installation](#installation)
* [Download latest release](#download-latest-release)
* [Install it](#install-it)
* [Download latest release](#download-latest-release)
* [Install it](#install-it)
* [Download](#download)
* [Install](#install)
* [Download](#download)
* [Install](#install)
* [Usage](#usage)
* [Commands](#commands)
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
@asyncapi/modelina-cli/5.4.0 linux-x64 node-v18.20.8
$ modelina --help [COMMAND]
USAGE
  $ modelina COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`modelina autocomplete [SHELL]`](#modelina-autocomplete-shell)
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
* [`modelina help [COMMAND]`](#modelina-help-command)
* [`modelina plugins`](#modelina-plugins)
* [`modelina plugins add PLUGIN`](#modelina-plugins-add-plugin)
* [`modelina plugins:inspect PLUGIN...`](#modelina-pluginsinspect-plugin)
* [`modelina plugins install PLUGIN`](#modelina-plugins-install-plugin)
* [`modelina plugins link PATH`](#modelina-plugins-link-path)
* [`modelina plugins remove [PLUGIN]`](#modelina-plugins-remove-plugin)
* [`modelina plugins reset`](#modelina-plugins-reset)
* [`modelina plugins uninstall [PLUGIN]`](#modelina-plugins-uninstall-plugin)
* [`modelina plugins unlink [PLUGIN]`](#modelina-plugins-unlink-plugin)
* [`modelina plugins update`](#modelina-plugins-update)
* [`modelina version`](#modelina-version)

## `modelina autocomplete [SHELL]`

Display autocomplete installation instructions.

```
USAGE
  $ modelina autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  (zsh|bash|powershell) Shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  Display autocomplete installation instructions.

EXAMPLES
  $ modelina autocomplete

  $ modelina autocomplete bash

  $ modelina autocomplete zsh

  $ modelina autocomplete powershell

  $ modelina autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v3.1.1/modelina-cli/src/commands/autocomplete/index.ts)_

## `modelina config`

CLI config settings

```
USAGE
  $ modelina config

DESCRIPTION
  CLI config settings
```

_See code: [src/commands/config/index.ts](https://github.com/asyncapi/modelina/blob/v5.4.0/modelina-cli/src/commands/config/index.ts)_

## `modelina config context`

Manage short aliases for full paths to inputs

```
USAGE
  $ modelina config context

DESCRIPTION
  Manage short aliases for full paths to inputs
```

_See code: [src/commands/config/context/index.ts](https://github.com/asyncapi/modelina/blob/v5.4.0/modelina-cli/src/commands/config/context/index.ts)_

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

_See code: [src/commands/config/context/add.ts](https://github.com/asyncapi/modelina/blob/v5.4.0/modelina-cli/src/commands/config/context/add.ts)_

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

_See code: [src/commands/config/context/current.ts](https://github.com/asyncapi/modelina/blob/v5.4.0/modelina-cli/src/commands/config/context/current.ts)_

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

_See code: [src/commands/config/context/edit.ts](https://github.com/asyncapi/modelina/blob/v5.4.0/modelina-cli/src/commands/config/context/edit.ts)_

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

_See code: [src/commands/config/context/init.ts](https://github.com/asyncapi/modelina/blob/v5.4.0/modelina-cli/src/commands/config/context/init.ts)_

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

_See code: [src/commands/config/context/list.ts](https://github.com/asyncapi/modelina/blob/v5.4.0/modelina-cli/src/commands/config/context/list.ts)_

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

_See code: [src/commands/config/context/remove.ts](https://github.com/asyncapi/modelina/blob/v5.4.0/modelina-cli/src/commands/config/context/remove.ts)_

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

_See code: [src/commands/config/context/use.ts](https://github.com/asyncapi/modelina/blob/v5.4.0/modelina-cli/src/commands/config/context/use.ts)_

## `modelina generate LANGUAGE FILE`

Generates typed models

```
USAGE
  $ modelina generate LANGUAGE FILE [-h] [-o <value>] [--packageName <value>] [--namespace <value>]
    [--tsModelType class|interface] [--tsEnumType enum|union] [--tsModuleSystem ESM|CJS] [--tsIncludeComments]
    [--tsExportType default|named] [--tsJsonBinPack] [--tsMarshalling] [--tsExampleInstance] [--tsRawPropertyNames]
    [--csharpAutoImplement] [--csharpNewtonsoft] [--csharpArrayType Array|List] [--csharpHashcode] [--csharpEqual]
    [--csharpSystemJson] [--goIncludeComments] [--goIncludeTags] [--javaIncludeComments] [--javaJackson]
    [--javaConstraints] [--javaArrayType Array|List] [--pyDantic]

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
      --goIncludeComments         Golang specific, if enabled add comments while generating models.
      --goIncludeTags             Golang specific, if enabled add tags while generating models.
      --javaArrayType=<option>    [default: Array] Java specific, define which type of array needs to be generated.
                                  <options: Array|List>
      --javaConstraints           Java specific, generate the models with constraints
      --javaIncludeComments       Java specific, if enabled add comments while generating models.
      --javaJackson               Java specific, generate the models with Jackson serialization support
      --namespace=<value>         C#, C++ and PHP specific, define the namespace to use for the generated models. This
                                  is required when language is `csharp`,`c++` or `php`.
      --packageName=<value>       Go, Java and Kotlin specific, define the package to use for the generated models. This
                                  is required when language is `go`, `java` or `kotlin`.
      --pyDantic                  Python specific, generate the Pydantic models.
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
      --tsRawPropertyNames        Typescript specific, generate the models using raw property names.

DESCRIPTION
  Generates typed models
```

_See code: [src/commands/generate.ts](https://github.com/asyncapi/modelina/blob/v5.4.0/modelina-cli/src/commands/generate.ts)_

## `modelina help [COMMAND]`

Display help for modelina.

```
USAGE
  $ modelina help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for modelina.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.1.0/modelina-cli/src/commands/help.ts)_

## `modelina plugins`

List installed plugins.

```
USAGE
  $ modelina plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ modelina plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.2.1/modelina-cli/src/commands/plugins/index.ts)_

## `modelina plugins add PLUGIN`

Installs a plugin into modelina.

```
USAGE
  $ modelina plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into modelina.

  Uses bundled npm executable to install plugins into /home/runner/.local/share/@asyncapi/modelina-cli

  Installation of a user-installed plugin will override a core plugin.

  Use the MODELINA_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the MODELINA_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ modelina plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ modelina plugins add myplugin

  Install a plugin from a github url.

    $ modelina plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ modelina plugins add someuser/someplugin
```

## `modelina plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ modelina plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ modelina plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.2.1/modelina-cli/src/commands/plugins/inspect.ts)_

## `modelina plugins install PLUGIN`

Installs a plugin into modelina.

```
USAGE
  $ modelina plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into modelina.

  Uses bundled npm executable to install plugins into /home/runner/.local/share/@asyncapi/modelina-cli

  Installation of a user-installed plugin will override a core plugin.

  Use the MODELINA_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the MODELINA_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ modelina plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ modelina plugins install myplugin

  Install a plugin from a github url.

    $ modelina plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ modelina plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.2.1/modelina-cli/src/commands/plugins/install.ts)_

## `modelina plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ modelina plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ modelina plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.2.1/modelina-cli/src/commands/plugins/link.ts)_

## `modelina plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ modelina plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ modelina plugins unlink
  $ modelina plugins remove

EXAMPLES
  $ modelina plugins remove myplugin
```

## `modelina plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ modelina plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.2.1/modelina-cli/src/commands/plugins/reset.ts)_

## `modelina plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ modelina plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ modelina plugins unlink
  $ modelina plugins remove

EXAMPLES
  $ modelina plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.2.1/modelina-cli/src/commands/plugins/uninstall.ts)_

## `modelina plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ modelina plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ modelina plugins unlink
  $ modelina plugins remove

EXAMPLES
  $ modelina plugins unlink myplugin
```

## `modelina plugins update`

Update installed plugins.

```
USAGE
  $ modelina plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.2.1/modelina-cli/src/commands/plugins/update.ts)_

## `modelina version`

```
USAGE
  $ modelina version [--json] [--verbose]

FLAGS
  --verbose  Show additional information about the CLI.

GLOBAL FLAGS
  --json  Format output as json.

FLAG DESCRIPTIONS
  --verbose  Show additional information about the CLI.

    Additionally shows the architecture, node version, operating system, and versions of plugins that the CLI is using.
```

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/v2.2.1/modelina-cli/src/commands/version.ts)_
<!-- commandsstop -->
