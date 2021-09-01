# How to use Modelina

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Understanding the output format](#understanding-the-output-format)
- [Generate models from AsyncAPI documents](#generate-models-from-asyncapi-documents)
- [Generate models from JSON Schema draft 7 documents](#generate-models-from-json-schema-draft-7-documents)
- [Generate Go models](#generate-go-models)
- [Generate C# models](#generate-c%23-models)
- [Generate Java models](#generate-java-models)
- [Generate TypeScript models](#generate-typescript-models)
- [Generate JavaScript models](#generate-javascript-models)
- [Change the generated indentation type and size](#change-the-generated-indentation-type-and-size)
- [Change the naming format for properties](#change-the-naming-format-for-properties)
- [Change the naming format for data models](#change-the-naming-format-for-data-models)

<!-- tocstop -->

## Understanding the output format
TODO 

## Generate models from AsyncAPI documents

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


## Generate models from JSON Schema draft 7 documents
The library expects the `$schema` property for the document to be sat in order to understand the input format, by default if no other inputs are detected, it defaults to JSON Schema draft 7.

- Generate from a pure JS object:

```js
generator.generate({$schema: 'http://json-schema.org/draft-07/schema#'});
```

## Generate Go models
TODO 

## Generate C# models
TODO 

## Generate Java models
TODO 

## Generate TypeScript models
TODO 

## Generate JavaScript models
TODO 

## Change the generated indentation type and size
TODO 

## Change the naming format for properties
TODO 

## Change the naming format for data models
TODO
