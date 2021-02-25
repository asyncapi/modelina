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

The process of creating data models from input data consists of three main process: transformation input data to JSON Schema, simplification and generation.

### The transformation process

The transformation process starts from checking what type of input data is provided and based on that it is processed differently. Currently JSON Schema Draft 7 and AsyncAPI version 2.0.0 are supported. It is also in this stage that references are resolved and schemas are named. Each input data must be converted to JSON Schema or be a subset of JSON Schema (like AsyncAPI spec) to go to the next process - the simplification stage.

### The simplification process

In order to simplify the model generation process as much as possible, AsyncAPI Model SDK simplifies the transformed JSON schema into `CommonModel`s, which contain information about the type of model it is, what properties it might have, etc, so finally we have a bare minimum schema. Think of it like converting data validation rules (JSON Schema) to a data definition.

Read [this](./docs/simplification.md) document for more information.

### The generatiion process

The generation process uses the predefined `CommonModel`s from the simplification stage to easily generate models. The AsyncAPI Model SDK generator support the following languages:

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

// interfaceModel should have the shape:
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

## Customisation

The AsyncAPI Model SDK uses **preset** objects to extend the rendered model. For more information, check [customisation document](./docs/customisation.md).

## Development

1. Setup project by installing dependencies `npm install`
2. Write code and tests.
3. Make sure all tests pass `npm test`
4. Make sure code is well formatted and secure `npm run lint`

## Contributing

Read [CONTRIBUTING](https://github.com/asyncapi/.github/blob/master/CONTRIBUTING.md) guide.
