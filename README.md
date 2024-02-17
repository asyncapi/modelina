[![AsyncAPI Modelina](./docs/img/readme-banner.png)](https://www.modelina.org)
[![blackbox pipeline status](<https://img.shields.io/github/actions/workflow/status/asyncapi/modelina/blackbox-testing.yml?label=blackbox%20testing>)](https://github.com/asyncapi/modelina/actions/workflows/blackbox-testing.yml?query=branch%3Amaster++)
[![Coverage Status](https://coveralls.io/repos/github/asyncapi/modelina/badge.svg?branch=master)](https://coveralls.io/github/asyncapi/modelina?branch=master)
[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
![Maintenance score](https://img.shields.io/npms-io/maintenance-score/@asyncapi/modelina)
[![Npm latest version](https://img.shields.io/npm/v/@asyncapi/modelina)](https://www.npmjs.com/package/@asyncapi/modelina)
[![License](https://img.shields.io/github/license/asyncapi/modelina)](https://github.com/asyncapi/modelina/blob/master/LICENSE)
[![last commit](https://img.shields.io/github/last-commit/asyncapi/modelina)](https://github.com/asyncapi/modelina/commits/master)
[![Discussions](https://img.shields.io/github/discussions/asyncapi/modelina)](https://github.com/asyncapi/modelina/discussions)
[![Website](https://img.shields.io/website?label=website&url=https%3A%2F%2Fwww.modelina.org)](https://www.modelina.org)
[![Playground](https://img.shields.io/website?label=playground&url=https%3A%2F%2Fwww.modelina.org%2Fplayground)](https://www.modelina.org/playground) <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-80-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Your one-stop tool for generating accurate and well-tested models for representing the message payloads. Use it as a tool in your development workflow, or a library in a larger integrations, entirely in your control.

---

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Installing Modelina](#installing-modelina)
- [AsyncAPI CLI](#asyncapi-cli)
- [Features](#features)
- [Requirements](#requirements)
- [Documentation](#documentation)
- [Examples](#examples)
- [Versioning and maintenance](#versioning-and-maintenance)
- [Development](#development)
- [Contributing](#contributing)
- [Contributors](#contributors)

<!-- tocstop -->

## Installing Modelina

Run this command to install Modelina in your project:

```bash
npm install @asyncapi/modelina
```

## AsyncAPI CLI

If you have the [AsyncAPI CLI installed](https://github.com/asyncapi/cli#installation) (ONLY support AsyncAPI inputs), you can run the following command to use [Modelina](https://github.com/asyncapi/cli#usage):

```bash
asyncapi generate models <language> ./asyncapi.json
```

<h2 align="center">What Does Modelina Do?</h2>

<p align="center">Modelina put YOU in control of your data models, here is how...</p>

<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td><b>Modelina lets you generate data models from many types of <a href="#inputs">inputs</a></b></td>
<td>

```typescript
const asyncapi = ...
const jsonschema = ...
const openapi = ... 
const metamodel = ... 
...
const models = await generator.generate(
  asyncapi | jsonschema | openapi | metamodel
);
```
</td>
  </tr>
    <tr>
    <td><b>Use the same inputs across a range of different <a href="#outputs">generators</a></b></td>
<td>

```typescript
const generator = new TypeScriptGenerator();
const generator = new CsharpGenerator();
const generator = new JavaGenerator();
const generator = new RustGenerator();
...
const models = await generator.generate(input);
```
</td>
  </tr>
    <tr>
    <td><b>Easily let you interact with the generated models.</b> 

- Want to show the generated models on a website? Sure! 
- Want to generate the models into files? Sure! 
- Want to combine all the models into one single file? Sure! 

Whatever interaction you need, you can create.</td>
<td>

```typescript
const models = await generator.generate(input);
for (const model in models) { 
  const generatedCode = model.result;
  const dependencies = model.dependencies;
  const modeltype = model.type;
  const modelName = model.modelName;
  ...
}
```
</td>
  </tr>
  <tr>
    <td><b>Easily modify how models are <a href="./docs/constraints.md">constrained</a> into the output</b></td>

<td>

```typescript
const generator = new TypeScriptGenerator({
  constraints: {
    modelName: ({modelName}) => {
      // Implement your own constraining logic
      return modelName;
    }
  }
});
```
</td>
  </tr>
  <tr>
    <td><b>Seamlessly layer additional or replacement code <a href="./docs/presets.md">on top of each other to customize the models</a> to your use-case</b></td>

<td>

```typescript
const generator = new TypeScriptGenerator({
  presets: [
    {
      class: {
        additionalContent({ content }) {
          return `${content}
public myCustomFunction(): string {
  return 'A custom function for each class';
}`;
        },
      }
    }
  ]
});
const models = await generator.generate(input);
```
</td>
  </tr>
  <tr>
    <td><b>Seamlessly lets you <a href="./docs/presets.md">combine multiple layers of additional or replacement code</a></b></td>

<td>

```typescript
const myCustomFunction1 = {
  class: {
    additionalContent({ content }) {
      return `${content}
public myCustomFunction(): string {
return 'A custom function for each class';
}`;
    },
  }
};
const myCustomFunction2 = {...};
const generator = new TypeScriptGenerator({
  presets: [
    myCustomFunction1,
    myCustomFunction2
  ]
});
const models = await generator.generate(input);
```
</td>
  </tr>
</table>

## Features

The following table provides a short summary of available features for supported output languages. To see the complete feature list for each language, please click the individual links for each language.

<a id="inputs"></a>

<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <th>Supported inputs</th>
    <th></th>
  </tr>
  <tr>
    <td><a href="./docs/usage.md#generate-models-from-asyncapi-documents">AsyncAPI</a></td>
    <td>We support the following AsyncAPI versions: <em>2.0.0 -> 2.6.0</em>, which generates models for all the defined message payloads. It supports the following schemaFormats AsyncAPI Schema object, JSON Schema draft 7, <a href="./examples/asyncapi-avro-schema">AVRO 1.9</a>, <a href="./examples/asyncapi-raml-schema">RAML 1.0 data type</a>, and <a href="./examples/asyncapi-openapi-schema">OpenAPI 3.0 Schema</a>.</td>
  </tr>
  <tr>
    <td><a href="./docs/usage.md#generate-models-from-json-schema-documents">JSON Schema</a></td>
    <td>We support the following JSON Schema versions: <em>Draft-4, Draft-6 and Draft-7</em></td>
  </tr>
  <tr>
    <td><a href="./docs/usage.md#generate-models-from-openapi-documents">OpenAPI</a></td>
    <td>We support the following OpenAPI versions: <em><a href="./docs/usage.md#generate-models-from-swagger-20-documents">Swagger 2.0</a> and <a href="./docs/usage.md#generate-models-from-openapi-documents">OpenAPI 3.0</a></em>, which generates models for all the defined request and response payloads.</td>
  </tr>
  <tr>
    <td><a href="./docs/usage.md#generate-model-from-typescript-type-files">TypeScript</a></td>
    <td>We currently support TypeScript types as file input for model generation</td>
  </tr>
  <tr>
    <td><a href="./docs/usage.md#generate-models-from-meta-models">Meta model</a></td>
    <td>This is the internal representation of a model for Modelina, it is what inputs gets converted to, and what generators are provided to generate code. Instead of relying on an input processor, you can create your own models from scratch and still take advantage on the generators and the features.</td>
  </tr>
</table>

<a id="outputs"></a>
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <th>Supported outputs</th>
    <th></th>
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
  <tr>
    <td><a href="./docs/usage.md#generate-rust-models">Rust</a></td>
    <td>Struct/tuple and enum generation: <em>generation of `implement Default`, generate serde macros, custom indentation type and size, etc</em></td>
  </tr>
  <tr>
    <td><a href="./docs/usage.md#generate-python-models">Python</a></td>
    <td>Class and enum generation: <em>custom indentation type and size, etc </em></td>
  </tr>
  <tr>
    <td><a href="./docs/usage.md#generate-kotlin-models">Kotlin</a></td>
    <td>Class and enum generation: <em>use of data classes where appropriate, custom indentation type and size, etc </em></td>
  </tr>
  <tr>
    <td><a href="./docs/usage.md#generate-cplusplus-models">C++</a></td>
    <td>Class and enum generation: <em>custom indentation type and size, etc </em></td>
  </tr>
  <tr>
    <td><a href="./docs/usage.md#generate-php-models">PHP</a></td>
    <td>Class and enum generation: <em>custom indentation type and size, descriptions, etc </em></td>
  </tr>
  <tr>
    <td><a href="./docs/usage.md#generate-scala-models">Scala</a></td>
    <td>Class and enum generation: <em>custom indentation type and size, descriptions, etc </em></td>
  </tr>
</table>

## Requirements
The following are a requirement in order to use Modelina.

- [NodeJS](https://nodejs.org/en/) >= 18

## Documentation
A feature in Modelina cannot exists without an example and documentation for it. You can find all the [documentation here](./docs/README.md).

## Examples
Do you need to know how to use the library in certain scenarios? 

We have gathered all the examples in a separate folder and they can be found under the [examples folder](./examples). 

## Versioning and maintenance
As of version 1, Modelina has a very strict set of changes we are allowed to do before it requires a major version change. In short, any changes that change the generated outcome are not allowed as it's a breaking change for the consumer of the generated models. 

Here is a list of changes we are allowed to do that would not require a breaking change:
- Adding new features (that do not change existing output), such as generators, presets, input processors, etc.
- Change existing features, by providing options that default to current behavior. This could be a preset that adapts the output based on options, as long as the API of Modelina and the API of the generated models does not have any breaking changes.
- Bug fixes where the generated code is otherwise unusable (syntax errors, etc).

Breaking changes are allowed and expected at a frequent rate, of course where it makes sense we will try to bundle multiple changes together.

We of course will do our best to uphold this, but mistakes can happen, and if you notice any breaking changes please let us know!

Because of the number of the limited number of champions, only the most recent major version will be maintained.

Major versions are currently happening at a 3-month cadence (in a similar fashion as the AsyncAPI specification), this will happen in January, April, June, and September. 

## Development
We try to make it as easy for you as possible to set up your development environment to contribute to Modelina. You can find the development documentation [here](./docs/development.md).

## Contributing
Without contributions, Modelina would not exist, it's a community project we build together to create the best possible building blocks, and we do this through [champions](./docs/champions.md).

We have made quite a [comprehensive contribution guide](./docs/contributing.md) to give you a lending hand in how different features and changes are introduced.

If no documentation helps you, here is how you can reach out to get help:
- On the [official AsycnAPI slack](https://asyncapi.com/slack-invite) under the `#04_tooling` channel
- Tag a specific [CODEOWNER](./CODEOWNERS) in your PR
- Generally, it's always a good idea to do everything in public, but in some cases, it might not be possible. In those circumstances you can contact the following: 
  - [jonaslagoni](https://github.com/jonaslagoni) (on [AsyncAPI Slack](https://asyncapi.com/slack-invite), [Twitter](https://twitter.com/jonaslagoni), [Email](mailto:jonas-lt@live.dk), [LinkedIn](https://www.linkedin.com/in/jonaslagoni/))

## Contributors 

Thanks go out to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/magicmatatjahu"><img src="https://avatars.githubusercontent.com/u/20404945?v=4?s=100" width="100px;" alt="Maciej Urbańczyk"/><br /><sub><b>Maciej Urbańczyk</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/issues?q=author%3Amagicmatatjahu" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/modelina/commits?author=magicmatatjahu" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=magicmatatjahu" title="Documentation">📖</a> <a href="#ideas-magicmatatjahu" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-magicmatatjahu" title="Maintenance">🚧</a> <a href="#question-magicmatatjahu" title="Answering Questions">💬</a> <a href="https://github.com/asyncapi/modelina/commits?author=magicmatatjahu" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Amagicmatatjahu" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/czlowiek488"><img src="https://avatars.githubusercontent.com/u/34620109?v=4?s=100" width="100px;" alt="czlowiek488"/><br /><sub><b>czlowiek488</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/issues?q=author%3Aczlowiek488" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Aczlowiek488" title="Reviewed Pull Requests">👀</a> <a href="#ideas-czlowiek488" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/smoya"><img src="https://avatars.githubusercontent.com/u/1083296?v=4?s=100" width="100px;" alt="Sergio Moya"/><br /><sub><b>Sergio Moya</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/issues?q=author%3Asmoya" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/modelina/commits?author=smoya" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=smoya" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/commits?author=smoya" title="Documentation">📖</a> <a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Asmoya" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jonaslagoni"><img src="https://avatars.githubusercontent.com/u/13396189?v=4?s=100" width="100px;" alt="Jonas Lagoni"/><br /><sub><b>Jonas Lagoni</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/issues?q=author%3Ajonaslagoni" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/modelina/commits?author=jonaslagoni" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=jonaslagoni" title="Documentation">📖</a> <a href="#ideas-jonaslagoni" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-jonaslagoni" title="Maintenance">🚧</a> <a href="#question-jonaslagoni" title="Answering Questions">💬</a> <a href="https://github.com/asyncapi/modelina/commits?author=jonaslagoni" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Ajonaslagoni" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://dev.to/derberg"><img src="https://avatars.githubusercontent.com/u/6995927?v=4?s=100" width="100px;" alt="Lukasz Gornicki"/><br /><sub><b>Lukasz Gornicki</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Aderberg" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/modelina/issues?q=author%3Aderberg" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/modelina/commits?author=derberg" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/arjungarg07"><img src="https://avatars.githubusercontent.com/u/53009722?v=4?s=100" width="100px;" alt="Arjun Garg"/><br /><sub><b>Arjun Garg</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=arjungarg07" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.fmvilas.com"><img src="https://avatars.githubusercontent.com/u/242119?v=4?s=100" width="100px;" alt="Fran Méndez"/><br /><sub><b>Fran Méndez</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Afmvilas" title="Reviewed Pull Requests">👀</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Blakelist7"><img src="https://avatars.githubusercontent.com/u/54525960?v=4?s=100" width="100px;" alt="Kanwal Singh"/><br /><sub><b>Kanwal Singh</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=Blakelist7" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.alejandraquetzalli.com"><img src="https://avatars.githubusercontent.com/u/19964402?v=4?s=100" width="100px;" alt="Alejandra Quetzalli "/><br /><sub><b>Alejandra Quetzalli </b></sub></a><br /><a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Aalequetzalli" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/modelina/commits?author=alequetzalli" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/md-saif-husain"><img src="https://avatars.githubusercontent.com/u/70682968?v=4?s=100" width="100px;" alt="MD SAIF  HUSAIN"/><br /><sub><b>MD SAIF  HUSAIN</b></sub></a><br /><a href="#example-md-saif-husain" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/commits?author=md-saif-husain" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/commits?author=md-saif-husain" title="Documentation">📖</a> <a href="https://github.com/asyncapi/modelina/commits?author=md-saif-husain" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://sudipto.ghosh.pro"><img src="https://avatars.githubusercontent.com/u/11232940?v=4?s=100" width="100px;" alt="Sudipto Ghosh"/><br /><sub><b>Sudipto Ghosh</b></sub></a><br /><a href="#example-sudiptog81" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/commits?author=sudiptog81" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/commits?author=sudiptog81" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/panwauu"><img src="https://avatars.githubusercontent.com/u/62597223?v=4?s=100" width="100px;" alt="panwauu"/><br /><sub><b>panwauu</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=panwauu" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=panwauu" title="Tests">⚠️</a> <a href="#example-panwauu" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/commits?author=panwauu" title="Documentation">📖</a> <a href="https://github.com/asyncapi/modelina/issues?q=author%3Apanwauu" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/stefanemayer/"><img src="https://avatars.githubusercontent.com/u/15031950?v=4?s=100" width="100px;" alt="Stefan E. Mayer"/><br /><sub><b>Stefan E. Mayer</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/issues?q=author%3Astefanerwinmayer" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/HashTalmiz"><img src="https://avatars.githubusercontent.com/u/55018280?v=4?s=100" width="100px;" alt="Talmiz Ahmed"/><br /><sub><b>Talmiz Ahmed</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=HashTalmiz" title="Documentation">📖</a> <a href="https://github.com/asyncapi/modelina/commits?author=HashTalmiz" title="Tests">⚠️</a> <a href="#example-HashTalmiz" title="Examples">💡</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ThanksForAllTheFish"><img src="https://avatars.githubusercontent.com/u/2169655?v=4?s=100" width="100px;" alt="Marco"/><br /><sub><b>Marco</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/issues?q=author%3AThanksForAllTheFish" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/quadrrem"><img src="https://avatars.githubusercontent.com/u/8450873?v=4?s=100" width="100px;" alt="quadrrem"/><br /><sub><b>quadrrem</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=quadrrem" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=quadrrem" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://kamko.dev"><img src="https://avatars.githubusercontent.com/u/17074375?v=4?s=100" width="100px;" alt="Kamil Janeček"/><br /><sub><b>Kamil Janeček</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=kamko" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/issues?q=author%3Akamko" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/modelina/commits?author=kamko" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mahakporwal02"><img src="https://avatars.githubusercontent.com/u/56486682?v=4?s=100" width="100px;" alt="mahakporwal02"/><br /><sub><b>mahakporwal02</b></sub></a><br /><a href="#example-mahakporwal02" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/commits?author=mahakporwal02" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/commits?author=mahakporwal02" title="Documentation">📖</a> <a href="https://github.com/asyncapi/modelina/commits?author=mahakporwal02" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ron-debajyoti"><img src="https://avatars.githubusercontent.com/u/22571664?v=4?s=100" width="100px;" alt="Debajyoti Halder"/><br /><sub><b>Debajyoti Halder</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=ron-debajyoti" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=ron-debajyoti" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/commits?author=ron-debajyoti" title="Documentation">📖</a> <a href="#example-ron-debajyoti" title="Examples">💡</a> <a href="#maintenance-ron-debajyoti" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://ritik307.github.io/portfolio/"><img src="https://avatars.githubusercontent.com/u/22374829?v=4?s=100" width="100px;" alt="Ritik Rawal"/><br /><sub><b>Ritik Rawal</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=ritik307" title="Documentation">📖</a> <a href="https://github.com/asyncapi/modelina/commits?author=ritik307" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=ritik307" title="Tests">⚠️</a> <a href="#example-ritik307" title="Examples">💡</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Ishan-Saini"><img src="https://avatars.githubusercontent.com/u/54525602?v=4?s=100" width="100px;" alt="Ishan"/><br /><sub><b>Ishan</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=Ishan-Saini" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=Ishan-Saini" title="Tests">⚠️</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://samridhi-98.github.io/Portfolio"><img src="https://avatars.githubusercontent.com/u/54466041?v=4?s=100" width="100px;" alt="Samriddhi"/><br /><sub><b>Samriddhi</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=Samridhi-98" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=Samridhi-98" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/commits?author=Samridhi-98" title="Documentation">📖</a> <a href="#example-Samridhi-98" title="Examples">💡</a> <a href="#maintenance-Samridhi-98" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/gabormagyar"><img src="https://avatars.githubusercontent.com/u/63397303?v=4?s=100" width="100px;" alt="Gábor Magyar"/><br /><sub><b>Gábor Magyar</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=gabormagyar" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=gabormagyar" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/commits?author=gabormagyar" title="Documentation">📖</a> <a href="#example-gabormagyar" title="Examples">💡</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ibernabeudev"><img src="https://avatars.githubusercontent.com/u/74215074?v=4?s=100" width="100px;" alt="ibernabeudev"/><br /><sub><b>ibernabeudev</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=ibernabeudev" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=ibernabeudev" title="Tests">⚠️</a> <a href="#example-ibernabeudev" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/commits?author=ibernabeudev" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/slowikowskiarkadiusz"><img src="https://avatars.githubusercontent.com/u/97508930?v=4?s=100" width="100px;" alt="Arkadiusz Słowikowski"/><br /><sub><b>Arkadiusz Słowikowski</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=slowikowskiarkadiusz" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=slowikowskiarkadiusz" title="Tests">⚠️</a> <a href="#example-slowikowskiarkadiusz" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/commits?author=slowikowskiarkadiusz" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Polygens"><img src="https://avatars.githubusercontent.com/u/3582318?v=4?s=100" width="100px;" alt="Willem Gillis"/><br /><sub><b>Willem Gillis</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=Polygens" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=Polygens" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/issues?q=author%3APolygens" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/rmasarovic"><img src="https://avatars.githubusercontent.com/u/1522834?v=4?s=100" width="100px;" alt="rmasarovic"/><br /><sub><b>rmasarovic</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=rmasarovic" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=rmasarovic" title="Documentation">📖</a> <a href="https://github.com/asyncapi/modelina/commits?author=rmasarovic" title="Tests">⚠️</a> <a href="#example-rmasarovic" title="Examples">💡</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/owais34"><img src="https://avatars.githubusercontent.com/u/37238759?v=4?s=100" width="100px;" alt="Owais Hasnath Ahmed"/><br /><sub><b>Owais Hasnath Ahmed</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=owais34" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=owais34" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/commits?author=owais34" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/PanMan"><img src="https://avatars.githubusercontent.com/u/978501?v=4?s=100" width="100px;" alt="PanMan"/><br /><sub><b>PanMan</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=PanMan" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/artur-ciocanu"><img src="https://avatars.githubusercontent.com/u/743192?v=4?s=100" width="100px;" alt="artur-ciocanu"/><br /><sub><b>artur-ciocanu</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=artur-ciocanu" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/issues?q=author%3Aartur-ciocanu" title="Bug reports">🐛</a> <a href="#example-artur-ciocanu" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/commits?author=artur-ciocanu" title="Documentation">📖</a> <a href="https://github.com/asyncapi/modelina/commits?author=artur-ciocanu" title="Tests">⚠️</a> <a href="#maintenance-artur-ciocanu" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://micro-jumbo.eu/"><img src="https://avatars.githubusercontent.com/u/11511697?v=4?s=100" width="100px;" alt="Cyprian Gracz"/><br /><sub><b>Cyprian Gracz</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=micro-jumbo" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=micro-jumbo" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/issues?q=author%3Amicro-jumbo" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.printnanny.ai"><img src="https://avatars.githubusercontent.com/u/2601819?v=4?s=100" width="100px;" alt="Leigh Johnson"/><br /><sub><b>Leigh Johnson</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=leigh-johnson" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=leigh-johnson" title="Tests">⚠️</a> <a href="#example-leigh-johnson" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/commits?author=leigh-johnson" title="Documentation">📖</a> <a href="#maintenance-leigh-johnson" title="Maintenance">🚧</a> <a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Aleigh-johnson" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/nitintejuja"><img src="https://avatars.githubusercontent.com/u/95347924?v=4?s=100" width="100px;" alt="Nitin Tejuja"/><br /><sub><b>Nitin Tejuja</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=nitintejuja" title="Tests">⚠️</a> <a href="#example-nitintejuja" title="Examples">💡</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/kennethaasan"><img src="https://avatars.githubusercontent.com/u/1437394?v=4?s=100" width="100px;" alt="Kenneth Aasan"/><br /><sub><b>Kenneth Aasan</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=kennethaasan" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=kennethaasan" title="Tests">⚠️</a> <a href="#maintenance-kennethaasan" title="Maintenance">🚧</a> <a href="https://github.com/asyncapi/modelina/commits?author=kennethaasan" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/amit-ksh"><img src="https://avatars.githubusercontent.com/u/91947037?v=4?s=100" width="100px;" alt="Amit Kumar Sharma"/><br /><sub><b>Amit Kumar Sharma</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=amit-ksh" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/commits?author=amit-ksh" title="Documentation">📖</a> <a href="#example-amit-ksh" title="Examples">💡</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/zaytsevand"><img src="https://avatars.githubusercontent.com/u/5207748?v=4?s=100" width="100px;" alt="Andrey Zaytsev"/><br /><sub><b>Andrey Zaytsev</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=zaytsevand" title="Code">💻</a> <a href="#example-zaytsevand" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/commits?author=zaytsevand" title="Documentation">📖</a> <a href="https://github.com/asyncapi/modelina/commits?author=zaytsevand" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/codingtenshi"><img src="https://avatars.githubusercontent.com/u/116377630?v=4?s=100" width="100px;" alt="Tenshi Codes"/><br /><sub><b>Tenshi Codes</b></sub></a><br /><a href="#infra-codingtenshi" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://yushiomote.org/"><img src="https://avatars.githubusercontent.com/u/3733915?v=4?s=100" width="100px;" alt="Yushi OMOTE"/><br /><sub><b>Yushi OMOTE</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/issues?q=author%3AYushiOMOTE" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/modelina/commits?author=YushiOMOTE" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://malcherczyk.pl"><img src="https://avatars.githubusercontent.com/u/17534504?v=4?s=100" width="100px;" alt="Zbigniew Malcherczyk"/><br /><sub><b>Zbigniew Malcherczyk</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/issues?q=author%3AFerror" title="Bug reports">🐛</a> <a href="#infra-Ferror" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/asyncapi/modelina/commits?author=Ferror" title="Code">💻</a> <a href="#example-Ferror" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/commits?author=Ferror" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3AFerror" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/200Puls"><img src="https://avatars.githubusercontent.com/u/6918360?v=4?s=100" width="100px;" alt="200Puls"/><br /><sub><b>200Puls</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=200Puls" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=200Puls" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://linktr.ee/anaysarkar7"><img src="https://avatars.githubusercontent.com/u/53341181?v=4?s=100" width="100px;" alt="Anay Sarkar"/><br /><sub><b>Anay Sarkar</b></sub></a><br /><a href="#example-anaysarkar7" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/commits?author=anaysarkar7" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=anaysarkar7" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/LouisXhaferi"><img src="https://avatars.githubusercontent.com/u/52397677?v=4?s=100" width="100px;" alt="Louis Xhaferi"/><br /><sub><b>Louis Xhaferi</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=LouisXhaferi" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/sambhavgupta0705"><img src="https://avatars.githubusercontent.com/u/81870866?v=4?s=100" width="100px;" alt="Sambhav Gupta"/><br /><sub><b>Sambhav Gupta</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=sambhavgupta0705" title="Documentation">📖</a> <a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Asambhavgupta0705" title="Reviewed Pull Requests">👀</a> <a href="#design-sambhavgupta0705" title="Design">🎨</a> <a href="https://github.com/asyncapi/modelina/commits?author=sambhavgupta0705" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/issues?q=author%3Asambhavgupta0705" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/prayutsu"><img src="https://avatars.githubusercontent.com/u/54636525?v=4?s=100" width="100px;" alt="Abhay Garg"/><br /><sub><b>Abhay Garg</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=prayutsu" title="Code">💻</a> <a href="#example-prayutsu" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/commits?author=prayutsu" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/commits?author=prayutsu" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/henrikjon"><img src="https://avatars.githubusercontent.com/u/27212232?v=4?s=100" width="100px;" alt="henrikjon"/><br /><sub><b>henrikjon</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=henrikjon" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=henrikjon" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/commits?author=henrikjon" title="Documentation">📖</a> <a href="#example-henrikjon" title="Examples">💡</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://yasirdeveloper.netlify.app/"><img src="https://avatars.githubusercontent.com/u/74600745?v=4?s=100" width="100px;" alt="Mohammad Yasir"/><br /><sub><b>Mohammad Yasir</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=Yasir761" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Savio629"><img src="https://avatars.githubusercontent.com/u/91362589?v=4?s=100" width="100px;" alt="Savio Dias"/><br /><sub><b>Savio Dias</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=Savio629" title="Code">💻</a> <a href="#infra-Savio629" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/asyncapi/modelina/issues?q=author%3ASavio629" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ishaan812"><img src="https://avatars.githubusercontent.com/u/70190533?v=4?s=100" width="100px;" alt="Ishaan Shah"/><br /><sub><b>Ishaan Shah</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=ishaan812" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Shreyas0410"><img src="https://avatars.githubusercontent.com/u/70795867?v=4?s=100" width="100px;" alt="Shreyas0410"/><br /><sub><b>Shreyas0410</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=Shreyas0410" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/beku-epitome"><img src="https://avatars.githubusercontent.com/u/115151513?v=4?s=100" width="100px;" alt="beku-epitome"/><br /><sub><b>beku-epitome</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=beku-epitome" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Abeku-epitome" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/modelina/commits?author=beku-epitome" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/swordmaster2k"><img src="https://avatars.githubusercontent.com/u/3354016?v=4?s=100" width="100px;" alt="Joshua Michael Daly"/><br /><sub><b>Joshua Michael Daly</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/issues?q=author%3Aswordmaster2k" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/dlkj"><img src="https://avatars.githubusercontent.com/u/243059?v=4?s=100" width="100px;" alt="Daniel KJ"/><br /><sub><b>Daniel KJ</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=dlkj" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=dlkj" title="Tests">⚠️</a> <a href="#example-dlkj" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Adlkj" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://codeyt.com/"><img src="https://avatars.githubusercontent.com/u/73033511?v=4?s=100" width="100px;" alt="Bhavik Agarwal"/><br /><sub><b>Bhavik Agarwal</b></sub></a><br /><a href="#design-Bhavik-ag" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/kaushik-rishi"><img src="https://avatars.githubusercontent.com/u/52498617?v=4?s=100" width="100px;" alt="Rishi"/><br /><sub><b>Rishi</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=kaushik-rishi" title="Code">💻</a> <a href="#design-kaushik-rishi" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://rohithboppey.netlify.app"><img src="https://avatars.githubusercontent.com/u/73538974?v=4?s=100" width="100px;" alt="Rohith Boppey"/><br /><sub><b>Rohith Boppey</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=RohithBoppey" title="Code">💻</a> <a href="#design-RohithBoppey" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://ashishpadhy.live"><img src="https://avatars.githubusercontent.com/u/100484401?v=4?s=100" width="100px;" alt="Ashish Padhy"/><br /><sub><b>Ashish Padhy</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=Shurtu-gal" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=Shurtu-gal" title="Tests">⚠️</a> <a href="#infra-Shurtu-gal" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://jfcote.github.io"><img src="https://avatars.githubusercontent.com/u/14336900?v=4?s=100" width="100px;" alt="Jean-François Côté"/><br /><sub><b>Jean-François Côté</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=JFCote" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=JFCote" title="Tests">⚠️</a> <a href="#example-JFCote" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/commits?author=JFCote" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/SumantxD"><img src="https://avatars.githubusercontent.com/u/65810424?v=4?s=100" width="100px;" alt="Sumant.xD"/><br /><sub><b>Sumant.xD</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=SumantxD" title="Tests">⚠️</a> <a href="#infra-SumantxD" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/asyncapi/modelina/commits?author=SumantxD" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/aryanas159"><img src="https://avatars.githubusercontent.com/u/114330931?v=4?s=100" width="100px;" alt="Aryan Singh"/><br /><sub><b>Aryan Singh</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=aryanas159" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://markus.poerschke.nrw"><img src="https://avatars.githubusercontent.com/u/1222377?v=4?s=100" width="100px;" alt="Markus Poerschke"/><br /><sub><b>Markus Poerschke</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=markuspoerschke" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=markuspoerschke" title="Tests">⚠️</a> <a href="#example-markuspoerschke" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/commits?author=markuspoerschke" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jamesmoey"><img src="https://avatars.githubusercontent.com/u/457472?v=4?s=100" width="100px;" alt="James Moey"/><br /><sub><b>James Moey</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=jamesmoey" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=jamesmoey" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/tomwolanski"><img src="https://avatars.githubusercontent.com/u/68085653?v=4?s=100" width="100px;" alt="tomwolanski"/><br /><sub><b>tomwolanski</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/issues?q=author%3Atomwolanski" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Ksisa"><img src="https://avatars.githubusercontent.com/u/53404771?v=4?s=100" width="100px;" alt="Kristupas"/><br /><sub><b>Kristupas</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=Ksisa" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Devansh-Bhatt"><img src="https://avatars.githubusercontent.com/u/94732079?v=4?s=100" width="100px;" alt="Devansh-Bhatt"/><br /><sub><b>Devansh-Bhatt</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=Devansh-Bhatt" title="Tests">⚠️</a> <a href="#infra-Devansh-Bhatt" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/pipliya"><img src="https://avatars.githubusercontent.com/u/56186142?v=4?s=100" width="100px;" alt="Ansh Pancholi"/><br /><sub><b>Ansh Pancholi</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=pipliya" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Qypol342"><img src="https://avatars.githubusercontent.com/u/37497007?v=4?s=100" width="100px;" alt="Maeght Loan"/><br /><sub><b>Maeght Loan</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=Qypol342" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=Qypol342" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://princerajpoot.com"><img src="https://avatars.githubusercontent.com/u/44585452?v=4?s=100" width="100px;" alt="Prince Rajpoot"/><br /><sub><b>Prince Rajpoot</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=princerajpoot20" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/harshit-senpai"><img src="https://avatars.githubusercontent.com/u/93075068?v=4?s=100" width="100px;" alt="harshit mishra "/><br /><sub><b>harshit mishra </b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=harshit-senpai" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/PeteAudinate"><img src="https://avatars.githubusercontent.com/u/99274874?v=4?s=100" width="100px;" alt="PeteAudinate"/><br /><sub><b>PeteAudinate</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=PeteAudinate" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jano-petras"><img src="https://avatars.githubusercontent.com/u/1147848?v=4?s=100" width="100px;" alt="jano-petras"/><br /><sub><b>jano-petras</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=jano-petras" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=jano-petras" title="Documentation">📖</a> <a href="https://github.com/asyncapi/modelina/commits?author=jano-petras" title="Tests">⚠️</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/nilkanth987"><img src="https://avatars.githubusercontent.com/u/12413581?v=4?s=100" width="100px;" alt="Nilkanth Parmar"/><br /><sub><b>Nilkanth Parmar</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=nilkanth987" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=nilkanth987" title="Tests">⚠️</a> <a href="#example-nilkanth987" title="Examples">💡</a> <a href="https://github.com/asyncapi/modelina/commits?author=nilkanth987" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://jaisarita.vercel.app/"><img src="https://avatars.githubusercontent.com/u/43639341?v=4?s=100" width="100px;" alt="Ashmit JaiSarita Gupta"/><br /><sub><b>Ashmit JaiSarita Gupta</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=devilkiller-ag" title="Code">💻</a> <a href="#design-devilkiller-ag" title="Design">🎨</a> <a href="https://github.com/asyncapi/modelina/commits?author=devilkiller-ag" title="Documentation">📖</a> <a href="#maintenance-devilkiller-ag" title="Maintenance">🚧</a> <a href="https://github.com/asyncapi/modelina/commits?author=devilkiller-ag" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/pulls?q=is%3Apr+reviewed-by%3Adevilkiller-ag" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://harshil.prose.sh"><img src="https://avatars.githubusercontent.com/u/79367883?v=4?s=100" width="100px;" alt="Harshil Jani"/><br /><sub><b>Harshil Jani</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=Harshil-Jani" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=Harshil-Jani" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://mintu-portfolio.netlify.app/"><img src="https://avatars.githubusercontent.com/u/127925465?v=4?s=100" width="100px;" alt="Mintu Gogoi"/><br /><sub><b>Mintu Gogoi</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=Min2who" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/devansh-m12"><img src="https://avatars.githubusercontent.com/u/86195162?v=4?s=100" width="100px;" alt="Devansh Mahant"/><br /><sub><b>Devansh Mahant</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=devansh-m12" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/officialasishkumar"><img src="https://avatars.githubusercontent.com/u/87874775?v=4?s=100" width="100px;" alt="Asish Kumar"/><br /><sub><b>Asish Kumar</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=officialasishkumar" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ankur0904"><img src="https://avatars.githubusercontent.com/u/98346896?v=4?s=100" width="100px;" alt="Ankur Singh"/><br /><sub><b>Ankur Singh</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=ankur0904" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/RowlandBanks"><img src="https://avatars.githubusercontent.com/u/9962551?v=4?s=100" width="100px;" alt="RowlandBanks"/><br /><sub><b>RowlandBanks</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=RowlandBanks" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=RowlandBanks" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/issues?q=author%3ARowlandBanks" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://moritzkalwa.dev/"><img src="https://avatars.githubusercontent.com/u/62842654?v=4?s=100" width="100px;" alt="Moritz Kalwa"/><br /><sub><b>Moritz Kalwa</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=moritzkalwa" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/commits?author=moritzkalwa" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/modelina/issues?q=author%3Amoritzkalwa" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/modelina/commits?author=moritzkalwa" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/akkshitgupta"><img src="https://avatars.githubusercontent.com/u/96991785?v=4?s=100" width="100px;" alt="Akshit Gupta"/><br /><sub><b>Akshit Gupta</b></sub></a><br /><a href="https://github.com/asyncapi/modelina/commits?author=akkshitgupta" title="Code">💻</a> <a href="https://github.com/asyncapi/modelina/issues?q=author%3Aakkshitgupta" title="Bug reports">🐛</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!
