<h5 align="center">
  <br>
  <a href="https://www.asyncapi.org"><img src="https://github.com/asyncapi/parser-nodejs/raw/master/assets/logo.png" alt="AsyncAPI logo" width="200"></a>
  <br>
  AsyncAPI Model SDK
</h5>
<p align="center">
  <em>The official SDK for generating data models from JSON Schema and AsyncAPI spec</em>
</p>

AsyncAPI Model SDK is a set of classes/functions for generating data models from JSON Schema and AsyncAPI spec.

![coverage-branches](./coverage-badge/badge-branches.svg)
![coverage-functions](./coverage-badge/badge-functions.svg)
![coverage-lines](./coverage-badge/badge-lines.svg)
![coverage-statements](./coverage-badge/badge-statements.svg)

---

## :loudspeaker: ATTENTION:

This package is under development and it has not reached version 1.0.0 yet, which means its API might get breaking changes without prior notice. Once it reaches its first stable version, we'll follow semantic versioning.

---

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Installation](#installation)
- [How it works](#how-it-works)
  * [The transformation process](#the-transformation-process)
  * [The simplification process](#the-simplification-process)
  * [The generatiion process](#the-generatiion-process)
- [Example](#example)
- [Customisation](#customisation)
- [Development](#development)
- [Contributing](#contributing)

<!-- tocstop -->

## Installation

Run this command to install the SDK in your project:

```bash
npm install --save @asyncapi/generator-model-sdk
```
## How it works

The process of creating data models from input data consists of 2 processes, the input and generation process.

### The input process

The input process ensures that any supported input is handled correctly, the basics are that any input needs to be converted into our internal model representation `CommonModel`. The following inputs are supported:
- [JSON Schema Draft 7](#JSON-Schema-input), this is the default inferred input if we cannot find a another input processor.
- [AsyncAPI version 2.0.0](#AsyncAPI-input)

Read more about the input process [here](./docs/input_processing.md).

### The generation process

The generation process uses the predefined `CommonModel`s from the input stage to easily generate models regardless of input. The generator support the following output languages:

- JavaScript
- TypeScript
- Java

Check out [the example](#example) to see how to use the library.

> **NOTE**: Each implemented language has different options, dictated by the nature of the language. Keep this in mind when selecting a language.

## Example

```js
import { TypeScriptGenerator } from '@asyncapi/generator-model-sdk';

const generator = new TypeScriptGenerator({ modelType: 'interface' });

const doc = {
  $id: "Address",
  type: "object",
  properties: {
    street_name:    { type: "string" },
    city:           { type: "string", description: "City description" },
    state:          { type: "string" },
    house_number:   { type: "number" },
    marriage:       { type: "boolean", description: "Status if marriage live in given house" },
    pet_names:      { type: "array", items: { type: "string" } },
    state:          { type: "string", enum: ["Texas", "Alabama", "California", "other"] },
  },
  required: ["street_name", "city", "state", "house_number", "state"],
};

const interfaceModel = await generator.generate(doc);

// interfaceModel[0] should have the shape:
interface Address {
  streetName: string;
  city: string;
  state: string;
  houseNumber: number;
  marriage?: boolean;
  petNames?: Array<string>;
  state?: "Texas" | "Alabama" | "California" | "other";
}
```
## Supported input
These are the supported inputs.
### AsyncAPI input
The library expects the `asyncapi` property for the document to be sat in order to understand the input format.
- Generate from a [parsed AsyncAPI document](https://github.com/asyncapi/parser-js)
```js
const parser = require('@asyncapi/parser');
const doc = await parser.parse(`{asyncapi: '2.0.0'}`);
generator.generate(doc);
```
- Generate from a pure JS object
```js
generator.generate({asyncapi: '2.0.0'});
```
### JSON Schema input
- Generate from a pure JS object
```js
generator.generate({$schema: 'http://json-schema.org/draft-07/schema#'});
```

## Customisation

The AsyncAPI Model SDK uses **preset** objects to extend the rendered model. For more information, check [customisation document](./docs/customisation.md).

## Development

1. Setup project by installing dependencies `npm install`
2. Write code and tests.
3. Make sure all tests pass `npm test`
4. Make sure code is well formatted and secure `npm run lint`

## Contributing

Read [CONTRIBUTING](https://github.com/asyncapi/.github/blob/master/CONTRIBUTING.md) guide.
