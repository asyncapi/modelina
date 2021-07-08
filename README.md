<h5 align="center">
  <br>
  <a href="https://www.asyncapi.org"><img src="https://github.com/asyncapi/parser-nodejs/raw/master/assets/logo.png" alt="AsyncAPI logo" width="200"></a>
  <br>
  Modelina
</h5>
<p align="center">
  <em>The official SDK for generating data models from JSON Schema and AsyncAPI spec</em>
</p>

[![Coverage Status](https://coveralls.io/repos/github/asyncapi/modelina/badge.svg?branch=master)](https://coveralls.io/github/asyncapi/modelina?branch=master)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-8-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

AsyncAPI Model SDK is a set of classes/functions for generating data models from JSON Schema and AsyncAPI spec.

---

## :loudspeaker: ATTENTION:

This package is under development and it has not reached version 1.0.0 yet, which means its API might get breaking changes without prior notice. Once it reaches its first stable version, we'll follow semantic versioning.

---

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Installation](#installation)
- [How it works](#how-it-works)
  * [The input process](#the-input-process)
  * [The generation process](#the-generation-process)
- [Example](#example)
- [Supported input](#supported-input)
  * [AsyncAPI input](#asyncapi-input)
  * [JSON Schema input](#json-schema-input)
- [Customization](#customization)
- [Development](#development)
- [Contributing](#contributing)
- [Contributors ✨](#contributors-%E2%9C%A8)

<!-- tocstop -->

## Installation

Run this command to install the SDK in your project:

```bash
npm install --save @asyncapi/modelina
```

## How it works

The process of creating data models from input data consists of 2 processes, the input and generation process.

### The input process

The input process ensures that any supported input is handled correctly, the basics are that any input needs to be converted into our internal model representation `CommonModel`. The following inputs are supported:

- [JSON Schema Draft 7](#JSON-Schema-input), this is the default inferred input if we cannot find another input processor.
- [AsyncAPI version 2.0.0 and 2.1.0](#AsyncAPI-input)

Read more about the input process [here](./docs/input_processing.md).

### The generation process

The generation process uses the predefined `CommonModel`s from the input stage to easily generate models regardless of input. 
The list of supported output languages can be found [here](./docs/generators.md#supported-languages).

Check out [the example](#example) to see how to use the library and [generators document](./docs/generators.md) for more info.

> **NOTE**: Each implemented language has different options, dictated by the nature of the language.

## Example

```js
import { TypeScriptGenerator } from '@asyncapi/modelina';

const generator = new TypeScriptGenerator({ modelType: 'interface' });

const doc = {
  $id: "Address",
  type: "object",
  properties: {
    street_name:    { type: "string" },
    city:           { type: "string", description: "City description" },
    house_number:   { type: "number" },
    marriage:       { type: "boolean", description: "Status if marriage live in given house" },
    pet_names:      { type: "array", items: { type: "string" } },
    state:          { type: "string", enum: ["Texas", "Alabama", "California", "other"] },
  },
  required: ["street_name", "city", "state", "house_number", "state"],
};

async function generate() {
  const models = await generator.generate(doc);
  models.forEach(model => console.log(model.result)); 
}

generate();
```

Output:

```ts
export interface Address {
  streetName: string;
  city: string;
  houseNumber: number;
  marriage?: boolean;
  petNames?: Array<string>;
  state: State;
  additionalProperties?: Map<String, object | string | number | Array<unknown> | boolean | null | number>;
}
export enum State {
  TEXAS = "Texas",
  ALABAMA = "Alabama",
  CALIFORNIA = "California",
  OTHER = "other",
}
```

## Supported input

These are the supported inputs.

### AsyncAPI input

The library expects the `asyncapi` property for the document to be sat in order to understand the input format.

- Generate from a [parsed AsyncAPI document](https://github.com/asyncapi/parser-js):

```js
const parser = require('@asyncapi/parser');
const doc = await parser.parse(`{asyncapi: '2.0.0'}`);
generator.generate(doc);
```

- Generate from a pure JS object:

```js
generator.generate({asyncapi: '2.0.0'});
```

### JSON Schema input

- Generate from a pure JS object:

```js
generator.generate({$schema: 'http://json-schema.org/draft-07/schema#'});
```

## Customization

There are multiple ways to customize the library both in terms of processing, logging and output generation, check the [customization document](./docs/customization.md).

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
