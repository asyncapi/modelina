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

This package is under development and it has not reached version 1.0.0 yet, what means its API might change without prior notice. Once it reaches its first stable version, we'll follow semantic versioning.

---

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Installation](#installation)
- [How it works](#how-it-works)
  * [The transformation process](#the-transformation-process)
  * [The simplification process](#the-simplification-process)
  * [The generatiion process](#the-generatiion-process)
- [Development](#development)
- [Contributing](#contributing)

<!-- tocstop -->

## Installation

Run this command to install the SDK in your project:

```bash
npm install --save @asyncapi/generator-model-sdk
```

## How it works

The process of creating data models from input data consists of three main process: transformation input data to JSON Schema, simplification and generatiion. 

### The transformation process

The transformation process starts from checking what type of input data is. Currently the AsyncAPI Model SDK supports JSON Schema and AsyncAPI spec. Each input data must be converted to the JSON Schema or be a subset of JSON Schema (like AsyncAPI spec) to go to the next process - the simplification process.

### The simplification process

In order to simplify the model generation process as much as possible, AsyncAPI Model SDK simplifies transformed JSON schema into CommonModels, which contain information what type of model is, what properties single model has, etc, so finally we have a bare minimum schema.

Read [this](./docs/simplification.md) document for more information.

### The generatiion process

The generation process uses predefined CommonModels. The generation begins with selecting the language for which the SDK should create models. The AsyncAPI Model SDK has currently implemented languages:

- JavaScript
- TypeScript
- Java

Check out [the example](#example) to see how to use the generation inside project.

> **NOTE**: Each implemented language has different options, dictated by the nature of the language. Keep this in mind on generating models.

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

// interfaceModel should have shape like:
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

## Development

1. Setup project by installing dependencies `npm install`
2. Write code and tests.
3. Make sure all tests pass `npm test`
4. Make sure code is well formatted and secure `npm run lint`

## Contributing

Read [CONTRIBUTING](https://github.com/asyncapi/.github/blob/master/CONTRIBUTING.md) guide.
