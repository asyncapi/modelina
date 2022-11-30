[![AsyncAPI Modelina](./assets/readme-banner.png)](https://www.asyncapi.com/tools/modelina)

Modelina is the official AsyncAPI SDK to generate data models (i.e. <a href="#outputs">Java/TypeScript classes, Go Structs, etc</a>) from <a href="#inputs">AsyncAPI documents, among other supported inputs</a>.

[![blackbox pipeline status](<https://img.shields.io/github/workflow/status/asyncapi/modelina/Blackbox%20testing%20(Stay%20Awhile%20and%20Listen)?label=blackbox%20testing>)](https://github.com/asyncapi/modelina/actions/workflows/blackbox-testing.yml?query=branch%3Amaster++)
[![Coverage Status](https://coveralls.io/repos/github/asyncapi/modelina/badge.svg?branch=master)](https://coveralls.io/github/asyncapi/modelina?branch=master)
[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)
![Maintenance score](https://img.shields.io/npms-io/maintenance-score/@asyncapi/modelina)
[![Npm latest version](https://img.shields.io/npm/v/@asyncapi/modelina)](https://www.npmjs.com/package/@asyncapi/modelina)
[![License](https://img.shields.io/github/license/asyncapi/modelina)](https://github.com/asyncapi/modelina/blob/master/LICENSE)
[![last commit](https://img.shields.io/github/last-commit/asyncapi/modelina)](https://github.com/asyncapi/modelina/commits/master)
[![Discussions](https://img.shields.io/github/discussions/asyncapi/modelina)](https://github.com/asyncapi/modelina/discussions)
[![Playground](https://img.shields.io/website?label=playground&url=https%3A%2F%2Fwww.asyncapi.com%2Ftools%2Fmodelina)](https://www.asyncapi.com/tools/modelina) <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-39-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

---

## :loudspeaker: ATTENTION:

This package is currently being prepared to reach version 1.0.0 and the development is therefore happening on the [`next` branch](https://github.com/asyncapi/modelina/tree/next), any features must be based and targetting that branch.

---

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Requirements](#requirements)
- [Installation](#installation)
- [Features](#features)
- [Roadmap](#roadmap)
- [Documentation](#documentation)
- [Examples](#examples)
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

<a id="inputs"></a>

<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <th>Supported inputs</th>
    <th>description</th>
  </tr>
  <tr>
    <td><a href="./docs/usage.md#generate-models-from-asyncapi-documents">AsyncAPI</a></td>
    <td>We support the following AsyncAPI versions: <em>2.0.0, 2.1.0, 2.2.0, 2.3.0 and 2.4.0</em>, which generates models for all the defined message payloads.</td>
  </tr>
  <tr>
    <td><a href="./docs/usage.md#generate-models-from-json-schema-documents">JSON Schema</a></td>
    <td>We support the following JSON Schema versions: <em>Draft-4, Draft-6 and Draft-7</em></td>
  </tr>
  <tr>
    <td>OpenAPI</td>
    <td>We support the following OpenAPI versions: <em><a href="./docs/usage.md#generate-models-from-swagger-20-documents">Swagger 2.0</a> and <a href="./docs/usage.md#generate-models-from-openapi-documents">OpenAPI 3.0</a></em>, which generates models for all the defined request and response payloads.</td>
  </tr>
  <tr>
    <td><a href="./docs/usage.md#generate-model-from-typescript-type-files">TypeScript file</a></td>
    <td>We currently support TypeScript type file as input for model generation</td>
  </tr>
</table>

<a id="outputs"></a>
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <th>Supported outputs</th>
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
  <tr>
    <td><a href="./docs/usage.md#generate-dart-models">Dart</a></td>
    <td>Class and enum generation: json_annotation</td>
  </tr>
</table>

## Roadmap
- [Reach version 1.0](https://github.com/asyncapi/modelina/milestone/3)

## Documentation
Documentation for this library can be found under the [documentation folder](./docs/README.md).

## Examples
Do you need to know how to use the library in certain scenarios? 

We have gathered all the examples in a separate folder and they can be found under the [examples folder](./examples). 

## Development
To setup your development environment please read the [development](./docs/development.md) document.

## Contributing

Read our [contributor](./docs/contributing.md) guide.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/magicmatatjahu"><img src="https://avatars.githubusercontent.com/u/20404945?v=4?s=100" width="100px;" alt="Maciej Urbańczyk"/><br /><sub><b>Maciej Urbańczyk</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/issues?q=author%3Amagicmatatjahu" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/modelina/commits?author=magicmatatjahu" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=magicmatatjahu" title="Documentation">📖</a> <a href="#ideas-magicmatatjahu" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-magicmatatjahu" title="Maintenance">🚧</a> <a href="#question-magicmatatjahu" title="Answering Questions">💬</a> <a href="https://github.com/asyncapi/modelina/commits?author=magicmatatjahu" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Amagicmatatjahu" title="Reviewed Pull Requests">👀</a></td>
      <td align="center"><a href="https://github.com/czlowiek488"><img src="https://avatars.githubusercontent.com/u/34620109?v=4?s=100" width="100px;" alt="czlowiek488"/><br /><sub><b>czlowiek488</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/issues?q=author%3Aczlowiek488" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Aczlowiek488" title="Reviewed Pull Requests">👀</a> <a href="#ideas-czlowiek488" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center"><a href="https://github.com/smoya"><img src="https://avatars.githubusercontent.com/u/1083296?v=4?s=100" width="100px;" alt="Sergio Moya"/><br /><sub><b>Sergio Moya</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/issues?q=author%3Asmoya" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/modelina/commits?author=smoya" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=smoya" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/commits?author=smoya" title="Documentation">📖</a> <a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Asmoya" title="Reviewed Pull Requests">👀</a></td>
      <td align="center"><a href="https://github.com/jonaslagoni"><img src="https://avatars.githubusercontent.com/u/13396189?v=4?s=100" width="100px;" alt="Jonas Lagoni"/><br /><sub><b>Jonas Lagoni</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/issues?q=author%3Ajonaslagoni" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/modelina/commits?author=jonaslagoni" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=jonaslagoni" title="Documentation">📖</a> <a href="#ideas-jonaslagoni" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-jonaslagoni" title="Maintenance">🚧</a> <a href="#question-jonaslagoni" title="Answering Questions">💬</a> <a href="https://github.com/asyncapi/modelina/commits?author=jonaslagoni" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Ajonaslagoni" title="Reviewed Pull Requests">👀</a></td>
      <td align="center"><a href="https://dev.to/derberg"><img src="https://avatars.githubusercontent.com/u/6995927?v=4?s=100" width="100px;" alt="Lukasz Gornicki"/><br /><sub><b>Lukasz Gornicki</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Aderberg" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/modelina/issues?q=author%3Aderberg" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/modelina/commits?author=derberg" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/arjungarg07"><img src="https://avatars.githubusercontent.com/u/53009722?v=4?s=100" width="100px;" alt="Arjun Garg"/><br /><sub><b>Arjun Garg</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=arjungarg07" title="Code">💻</a></td>
      <td align="center"><a href="http://www.fmvilas.com"><img src="https://avatars.githubusercontent.com/u/242119?v=4?s=100" width="100px;" alt="Fran Méndez"/><br /><sub><b>Fran Méndez</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Afmvilas" title="Reviewed Pull Requests">👀</a></td>
    </tr>
    <tr>
      <td align="center"><a href="https://github.com/Blakelist7"><img src="https://avatars.githubusercontent.com/u/54525960?v=4?s=100" width="100px;" alt="Kanwal Singh"/><br /><sub><b>Kanwal Singh</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=Blakelist7" title="Code">💻</a></td>
      <td align="center"><a href="http://www.alejandraquetzalli.com"><img src="https://avatars.githubusercontent.com/u/19964402?v=4?s=100" width="100px;" alt="Alejandra Quetzalli "/><br /><sub><b>Alejandra Quetzalli </b></sub></a><br /><a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Aalequetzalli" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/modelina/commits?author=alequetzalli" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/md-saif-husain"><img src="https://avatars.githubusercontent.com/u/70682968?v=4?s=100" width="100px;" alt="MD SAIF  HUSAIN"/><br /><sub><b>MD SAIF  HUSAIN</b></sub></a><br /><a href="#example-md-saif-husain" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/commits?author=md-saif-husain" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/commits?author=md-saif-husain" title="Documentation">📖</a> <a href="https://github.com/asyncapi/modelina/commits?author=md-saif-husain" title="Code">💻</a></td>
      <td align="center"><a href="https://sudipto.ghosh.pro"><img src="https://avatars.githubusercontent.com/u/11232940?v=4?s=100" width="100px;" alt="Sudipto Ghosh"/><br /><sub><b>Sudipto Ghosh</b></sub></a><br /><a href="#example-sudiptog81" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/commits?author=sudiptog81" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/commits?author=sudiptog81" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/panwauu"><img src="https://avatars.githubusercontent.com/u/62597223?v=4?s=100" width="100px;" alt="panwauu"/><br /><sub><b>panwauu</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=panwauu" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=panwauu" title="Tests">⚠️</a> <a href="#example-panwauu" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/commits?author=panwauu" title="Documentation">📖</a> <a href="https://github.com/asyncapi/modelina/issues?q=author%3Apanwauu" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://www.linkedin.com/in/stefanemayer/"><img src="https://avatars.githubusercontent.com/u/15031950?v=4?s=100" width="100px;" alt="Stefan E. Mayer"/><br /><sub><b>Stefan E. Mayer</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/issues?q=author%3Astefanerwinmayer" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://github.com/HashTalmiz"><img src="https://avatars.githubusercontent.com/u/55018280?v=4?s=100" width="100px;" alt="Talmiz Ahmed"/><br /><sub><b>Talmiz Ahmed</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=HashTalmiz" title="Documentation">📖</a> <a href="https://github.com/asyncapi/modelina/commits?author=HashTalmiz" title="Tests">⚠️</a> <a href="#example-HashTalmiz" title="Examples">💡</a></td>
    </tr>
    <tr>
      <td align="center"><a href="https://github.com/ThanksForAllTheFish"><img src="https://avatars.githubusercontent.com/u/2169655?v=4?s=100" width="100px;" alt="Marco"/><br /><sub><b>Marco</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/issues?q=author%3AThanksForAllTheFish" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://github.com/quadrrem"><img src="https://avatars.githubusercontent.com/u/8450873?v=4?s=100" width="100px;" alt="quadrrem"/><br /><sub><b>quadrrem</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=quadrrem" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=quadrrem" title="Tests">⚠️</a></td>
      <td align="center"><a href="https://kamko.dev"><img src="https://avatars.githubusercontent.com/u/17074375?v=4?s=100" width="100px;" alt="Kamil Janeček"/><br /><sub><b>Kamil Janeček</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=kamko" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/issues?q=author%3Akamko" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/modelina/commits?author=kamko" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/mahakporwal02"><img src="https://avatars.githubusercontent.com/u/56486682?v=4?s=100" width="100px;" alt="mahakporwal02"/><br /><sub><b>mahakporwal02</b></sub></a><br /><a href="#example-mahakporwal02" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/commits?author=mahakporwal02" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/commits?author=mahakporwal02" title="Documentation">📖</a> <a href="https://github.com/asyncapi/modelina/commits?author=mahakporwal02" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/ron-debajyoti"><img src="https://avatars.githubusercontent.com/u/22571664?v=4?s=100" width="100px;" alt="Debajyoti Halder"/><br /><sub><b>Debajyoti Halder</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=ron-debajyoti" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=ron-debajyoti" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/commits?author=ron-debajyoti" title="Documentation">📖</a> <a href="#example-ron-debajyoti" title="Examples">💡</a> <a href="#maintenance-ron-debajyoti" title="Maintenance">🚧</a></td>
      <td align="center"><a href="https://ritik307.github.io/portfolio/"><img src="https://avatars.githubusercontent.com/u/22374829?v=4?s=100" width="100px;" alt="Ritik Rawal"/><br /><sub><b>Ritik Rawal</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=ritik307" title="Documentation">📖</a> <a href="https://github.com/asyncapi/modelina/commits?author=ritik307" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=ritik307" title="Tests">⚠️</a> <a href="#example-ritik307" title="Examples">💡</a></td>
      <td align="center"><a href="https://github.com/Ishan-Saini"><img src="https://avatars.githubusercontent.com/u/54525602?v=4?s=100" width="100px;" alt="Ishan"/><br /><sub><b>Ishan</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=Ishan-Saini" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=Ishan-Saini" title="Tests">⚠️</a></td>
    </tr>
    <tr>
      <td align="center"><a href="https://samridhi-98.github.io/Portfolio"><img src="https://avatars.githubusercontent.com/u/54466041?v=4?s=100" width="100px;" alt="Samriddhi"/><br /><sub><b>Samriddhi</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=Samridhi-98" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=Samridhi-98" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/commits?author=Samridhi-98" title="Documentation">📖</a> <a href="#example-Samridhi-98" title="Examples">💡</a> <a href="#maintenance-Samridhi-98" title="Maintenance">🚧</a></td>
      <td align="center"><a href="https://github.com/gabormagyar"><img src="https://avatars.githubusercontent.com/u/63397303?v=4?s=100" width="100px;" alt="Gábor Magyar"/><br /><sub><b>Gábor Magyar</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=gabormagyar" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=gabormagyar" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/commits?author=gabormagyar" title="Documentation">📖</a> <a href="#example-gabormagyar" title="Examples">💡</a></td>
      <td align="center"><a href="https://github.com/ibernabeudev"><img src="https://avatars.githubusercontent.com/u/74215074?v=4?s=100" width="100px;" alt="ibernabeudev"/><br /><sub><b>ibernabeudev</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=ibernabeudev" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=ibernabeudev" title="Tests">⚠️</a> <a href="#example-ibernabeudev" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/commits?author=ibernabeudev" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/slowikowskiarkadiusz"><img src="https://avatars.githubusercontent.com/u/97508930?v=4?s=100" width="100px;" alt="Arkadiusz Słowikowski"/><br /><sub><b>Arkadiusz Słowikowski</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=slowikowskiarkadiusz" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=slowikowskiarkadiusz" title="Tests">⚠️</a> <a href="#example-slowikowskiarkadiusz" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/commits?author=slowikowskiarkadiusz" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/Polygens"><img src="https://avatars.githubusercontent.com/u/3582318?v=4?s=100" width="100px;" alt="Willem Gillis"/><br /><sub><b>Willem Gillis</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=Polygens" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=Polygens" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/issues?q=author%3APolygens" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://github.com/rmasarovic"><img src="https://avatars.githubusercontent.com/u/1522834?v=4?s=100" width="100px;" alt="rmasarovic"/><br /><sub><b>rmasarovic</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=rmasarovic" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=rmasarovic" title="Documentation">📖</a> <a href="https://github.com/asyncapi/modelina/commits?author=rmasarovic" title="Tests">⚠️</a> <a href="#example-rmasarovic" title="Examples">💡</a></td>
      <td align="center"><a href="https://github.com/owais34"><img src="https://avatars.githubusercontent.com/u/37238759?v=4?s=100" width="100px;" alt="Owais Hasnath Ahmed"/><br /><sub><b>Owais Hasnath Ahmed</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=owais34" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=owais34" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/commits?author=owais34" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center"><a href="https://github.com/PanMan"><img src="https://avatars.githubusercontent.com/u/978501?v=4?s=100" width="100px;" alt="PanMan"/><br /><sub><b>PanMan</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=PanMan" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/artur-ciocanu"><img src="https://avatars.githubusercontent.com/u/743192?v=4?s=100" width="100px;" alt="artur-ciocanu"/><br /><sub><b>artur-ciocanu</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=artur-ciocanu" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/issues?q=author%3Aartur-ciocanu" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://micro-jumbo.eu/"><img src="https://avatars.githubusercontent.com/u/11511697?v=4?s=100" width="100px;" alt="Cyprian Gracz"/><br /><sub><b>Cyprian Gracz</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=micro-jumbo" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=micro-jumbo" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/issues?q=author%3Amicro-jumbo" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://www.printnanny.ai"><img src="https://avatars.githubusercontent.com/u/2601819?v=4?s=100" width="100px;" alt="Leigh Johnson"/><br /><sub><b>Leigh Johnson</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=leigh-johnson" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=leigh-johnson" title="Tests">⚠️</a> <a href="#example-leigh-johnson" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/commits?author=leigh-johnson" title="Documentation">📖</a> <a href="#maintenance-leigh-johnson" title="Maintenance">🚧</a> <a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Aleigh-johnson" title="Reviewed Pull Requests">👀</a></td>
      <td align="center"><a href="https://github.com/nitintejuja"><img src="https://avatars.githubusercontent.com/u/95347924?v=4?s=100" width="100px;" alt="Nitin Tejuja"/><br /><sub><b>Nitin Tejuja</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=nitintejuja" title="Tests">⚠️</a> <a href="#example-nitintejuja" title="Examples">💡</a></td>
      <td align="center"><a href="https://github.com/kennethaasan"><img src="https://avatars.githubusercontent.com/u/1437394?v=4?s=100" width="100px;" alt="Kenneth Aasan"/><br /><sub><b>Kenneth Aasan</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=kennethaasan" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=kennethaasan" title="Tests">⚠️</a></td>
      <td align="center"><a href="https://github.com/amit-ksh"><img src="https://avatars.githubusercontent.com/u/91947037?v=4?s=100" width="100px;" alt="Amit Kumar Sharma"/><br /><sub><b>Amit Kumar Sharma</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=amit-ksh" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/commits?author=amit-ksh" title="Documentation">📖</a> <a href="#example-amit-ksh" title="Examples">💡</a></td>
    </tr>
    <tr>
      <td align="center"><a href="https://github.com/codingtenshi"><img src="https://avatars.githubusercontent.com/u/116377630?v=4?s=100" width="100px;" alt="Tenshi Codes"/><br /><sub><b>Tenshi Codes</b></sub></a><br /><a href="#infra-codingtenshi" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center"><a href="http://yushiomote.org/"><img src="https://avatars.githubusercontent.com/u/3733915?v=4?s=100" width="100px;" alt="Yushi OMOTE"/><br /><sub><b>Yushi OMOTE</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/issues?q=author%3AYushiOMOTE" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/modelina/commits?author=YushiOMOTE" title="Code">💻</a></td>
      <td align="center"><a href="https://malcherczyk.pl"><img src="https://avatars.githubusercontent.com/u/17534504?v=4?s=100" width="100px;" alt="Zbigniew Malcherczyk"/><br /><sub><b>Zbigniew Malcherczyk</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/issues?q=author%3AFerror" title="Bug reports">🐛</a> <a href="#infra-Ferror" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center"><a href="https://github.com/200Puls"><img src="https://avatars.githubusercontent.com/u/6918360?v=4?s=100" width="100px;" alt="200Puls"/><br /><sub><b>200Puls</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=200Puls" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=200Puls" title="Tests">⚠️</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
