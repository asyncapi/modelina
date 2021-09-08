# Usages
Modelina can be used in many different contexts and has many features, all depending on the output language. This document will walk you through you the library's basic usages.

For more advanced use-cases, please check out the [advanced document](./advanced.md).

For more specific integration options, please check out the [integration document](./integration.md).

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

<!-- tocstop -->

## Understanding the output format
TODO 

## Generate models from AsyncAPI documents

There are two ways to generate models for an AsyncAPI document.

- [Generate from a parsed AsyncAPI document](../examples/asyncapi-from-parser)
- [Generate from a pure JS object](../examples/asyncapi-from-object)

The library expects the `asyncapi` property for the document to be set in order to understand the input format.

## Generate models from JSON Schema draft 7 documents

There are one way to generate models from a JSON Schema draft 7 document.

- [Generate from a pure JS object](../examples/json-schema-draft7-from-object)

The library expects the `$schema` property for the document to be set in order to understand the input format. By default, if no other inputs are detected, it defaults to `JSON Schema draft 7`.

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
