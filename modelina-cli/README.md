oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g modelina-cli
$ modelina COMMAND
running command...
$ modelina (--version)
modelina-cli/0.0.0 linux-x64 node-v21.2.0
$ modelina --help [COMMAND]
USAGE
  $ modelina COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`modelina hello PERSON`](#modelina-hello-person)
* [`modelina hello world`](#modelina-hello-world)
* [`modelina help [COMMANDS]`](#modelina-help-commands)
* [`modelina plugins`](#modelina-plugins)
* [`modelina plugins:install PLUGIN...`](#modelina-pluginsinstall-plugin)
* [`modelina plugins:inspect PLUGIN...`](#modelina-pluginsinspect-plugin)
* [`modelina plugins:install PLUGIN...`](#modelina-pluginsinstall-plugin-1)
* [`modelina plugins:link PLUGIN`](#modelina-pluginslink-plugin)
* [`modelina plugins:uninstall PLUGIN...`](#modelina-pluginsuninstall-plugin)
* [`modelina plugins reset`](#modelina-plugins-reset)
* [`modelina plugins:uninstall PLUGIN...`](#modelina-pluginsuninstall-plugin-1)
* [`modelina plugins:uninstall PLUGIN...`](#modelina-pluginsuninstall-plugin-2)
* [`modelina plugins update`](#modelina-plugins-update)

## `modelina hello PERSON`

Say hello

```
USAGE
  $ modelina hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/devilkiller-ag/modelina-cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `modelina hello world`

Say hello world

```
USAGE
  $ modelina hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ modelina hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/devilkiller-ag/modelina-cli/blob/v0.0.0/src/commands/hello/world.ts)_

## `modelina help [COMMANDS]`

Display help for modelina.

```
USAGE
  $ modelina help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for modelina.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.12/src/commands/help.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.1/src/commands/plugins/index.ts)_

## `modelina plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ modelina plugins add plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ modelina plugins add

EXAMPLES
  $ modelina plugins add myplugin 

  $ modelina plugins add https://github.com/someuser/someplugin

  $ modelina plugins add someuser/someplugin
```

## `modelina plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ modelina plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.1/src/commands/plugins/inspect.ts)_

## `modelina plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ modelina plugins install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ modelina plugins add

EXAMPLES
  $ modelina plugins install myplugin 

  $ modelina plugins install https://github.com/someuser/someplugin

  $ modelina plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.1/src/commands/plugins/install.ts)_

## `modelina plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ modelina plugins link PLUGIN

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.1/src/commands/plugins/link.ts)_

## `modelina plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ modelina plugins remove plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.1/src/commands/plugins/reset.ts)_

## `modelina plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ modelina plugins uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.1/src/commands/plugins/uninstall.ts)_

## `modelina plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ modelina plugins unlink plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.1/src/commands/plugins/update.ts)_
<!-- commandsstop -->
