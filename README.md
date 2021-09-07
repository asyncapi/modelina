<h5 align="center">
  <br>
  <a href="https://www.asyncapi.org"><img src="https://github.com/asyncapi/parser-nodejs/raw/master/assets/logo.png" alt="AsyncAPI logo" width="200"></a>
  <br>
  <em><b>Modelina</b>
</h5>
<p align="center">
   Modelina is the official AsyncAPI SDK used to generate different data models (i.e. Java/TypeScript classes, Go Structs, etc) for AsyncAPI documents, among other supported inputs.</em>
</p>

[![Coverage Status](https://coveralls.io/repos/github/asyncapi/modelina/badge.svg?branch=master)](https://coveralls.io/github/asyncapi/modelina?branch=master)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-8-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

---

## :loudspeaker: ATTENTION:

This package is still under development and has not reached version 1.0.0 yet. This means that its API may contain breaking changes until we're able to deploy the first stable version and begin semantic versioning. Please use tests to ensure expected outputs or to hardcode the version.

---

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Requirements](#requirements)
- [Installation](#installation)
- [Features](#features)
- [Roadmap](#roadmap)
- [Documentation](#documentation)
- [Development](#development)
- [Contributing](#contributing)
- [Contributors ✨](#contributors-%E2%9C%A8)

<!-- tocstop -->

## Requirements

- [NodeJS](https://nodejs.org/en/) >= 14

Feel free to submit an issue if you require this project in other use-cases.

## Installation
Run this command to install Modelina in your project:

```bash
npm install @asyncapi/modelina
```

Once you've successfully installed Modelina in your project, it's time to select your generator. Check out the [examples](#examples) for the specific code.

## Features
The following table provides a short summary of available features for supported output languages.

To see the complete feature list for each language, please click the individual links for each language.


<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <th>Supported languages</th>
    <th>Features</th>
  </tr>
  <tr>
    <td><a href="./docs/usage.md#generate-java-models">Java</a></td>
    <td>Class and enum generation: <em>generation of equals, hashCode, toString, Jackson annotation, custom indentation type and size, etc</em></td>
  </tr>
  <tr>
    <td><a href="./docs/usage.md#generate-typescript-models">TypeScript</a></td>
    <td>Class, interface and enum generation: <em>generation of example code, un/marshal functions, custom indentation type and size, etc</em></td>
  </tr>
  <tr>
    <td><a href="./docs/usage.md#generate-c#-models">C#</a></td>
    <td>Class and enum generation: <em>generation of example code, serializer and deserializer functions, custom indentation type and size, etc</em></td>
  </tr>
  <tr>
    <td><a href="./docs/usage.md#generate-go-models">Go</a></td>
    <td>Struct and enum generation: <em>custom indentation type and size, etc </em></td>
  </tr>
  <tr>
    <td><a href="./docs/usage.md#generate-javascript-models">JavaScript</a></td>
    <td>Class generation: <em>custom indentation type and size, etc</em></td>
  </tr>
</table>

## Roadmap
- [Reach version 1.0](https://github.com/asyncapi/modelina/milestone/3)

## Documentation
The documentation for this library can all be found under the documentation [README](./docs/README.md).

## Examples
We have gathered all the examples, in a separate folder to ensure consistency, they can be found under the [example folder](./examples). 

## Development
To setup your development environment please read the [development](./docs/development.md) document.

## Contributing

Read [CONTRIBUTING](https://github.com/asyncapi/.github/blob/master/CONTRIBUTING.md) guide.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/magicmatatjahu"><img src="https://avatars.githubusercontent.com/u/20404945?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Maciej Urbańczyk</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/issues?q=author%3Amagicmatatjahu" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/modelina/commits?author=magicmatatjahu" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=magicmatatjahu" title="Documentation">📖</a> <a href="#ideas-magicmatatjahu" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-magicmatatjahu" title="Maintenance">🚧</a> <a href="#question-magicmatatjahu" title="Answering Questions">💬</a> <a href="https://github.com/asyncapi/modelina/commits?author=magicmatatjahu" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Amagicmatatjahu" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/czlowiek488"><img src="https://avatars.githubusercontent.com/u/34620109?v=4?s=100" width="100px;" alt=""/><br /><sub><b>czlowiek488</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/issues?q=author%3Aczlowiek488" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Aczlowiek488" title="Reviewed Pull Requests">👀</a> <a href="#ideas-czlowiek488" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/smoya"><img src="https://avatars.githubusercontent.com/u/1083296?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sergio Moya</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/issues?q=author%3Asmoya" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/modelina/commits?author=smoya" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=smoya" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/commits?author=smoya" title="Documentation">📖</a> <a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Asmoya" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/jonaslagoni"><img src="https://avatars.githubusercontent.com/u/13396189?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jonas Lagoni</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/issues?q=author%3Ajonaslagoni" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/modelina/commits?author=jonaslagoni" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=jonaslagoni" title="Documentation">📖</a> <a href="#ideas-jonaslagoni" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-jonaslagoni" title="Maintenance">🚧</a> <a href="#question-jonaslagoni" title="Answering Questions">💬</a> <a href="https://github.com/asyncapi/modelina/commits?author=jonaslagoni" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Ajonaslagoni" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://dev.to/derberg"><img src="https://avatars.githubusercontent.com/u/6995927?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lukasz Gornicki</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Aderberg" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/modelina/issues?q=author%3Aderberg" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/modelina/commits?author=derberg" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/arjungarg07"><img src="https://avatars.githubusercontent.com/u/53009722?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Arjun Garg</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=arjungarg07" title="Code">💻</a></td>
    <td align="center"><a href="http://www.fmvilas.com"><img src="https://avatars.githubusercontent.com/u/242119?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Fran Méndez</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Afmvilas" title="Reviewed Pull Requests">👀</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/Blakelist7"><img src="https://avatars.githubusercontent.com/u/54525960?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kanwal Singh</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=Blakelist7" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
