# Usages

Modelina can be used in many different contexts and has many features, all depending on the output language. This document will walk you through you the library's basic usages.

For more advanced use-cases, please check out the [advanced document](./advanced.md).

For more specific integration options, please check out the [integration document](./integration.md).

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Understanding the output format](#understanding-the-output-format)
- [Generate models from AsyncAPI documents](#generate-models-from-asyncapi-documents)
- [Generate models from JSON Schema documents](#generate-models-from-json-schema-documents)
- [Generate models from Swagger 2.0 documents](#generate-models-from-swagger-20-documents)
- [Generate models from OpenAPI documents](#generate-models-from-openapi-documents)
- [Generate models from TypeScript type files](#generate-models-from-typescript-type-files)
- [Generate models from Meta models](#generate-models-from-meta-models)
- [Generate models from OpenAPI documents](#generate-models-from-openapi-documents-1)
- [Generate Go models](#generate-go-models)
- [Generate C# models](#generate-c%23-models)
- [Generate Java models](#generate-java-models)
- [Generate TypeScript models](#generate-typescript-models)
- [Generate JavaScript models](#generate-javascript-models)
- [Generate Dart models](#generate-dart-models)
- [Generate Rust models](#generate-rust-models)

<!-- tocstop -->

## Understanding the output format

TODO

## Generate models from AsyncAPI documents

When providing an AsyncAPI document, the library iterates the entire document and generate models for all defined messages. If any other kind of iteration is wanted, feel free to create a [feature request](https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md).

There are two ways to generate models for an AsyncAPI document.

- [Generate from a parsed AsyncAPI document](../examples/asyncapi-from-parser)
- [Generate from a pure JS object](../examples/asyncapi-from-object)

The library expects the `asyncapi` property for the document to be set in order to understand the input format.

The message payloads, since it is a JSON Schema variant, is [interpreted as a such](./interpretation_of_JSON_Schema.md).

## Generate models from JSON Schema documents

There is one way to generate models for a JSON Schema document.

- [Generate from a pure JS object](../examples/json-schema-draft7-from-object)

We support both draft-4, draft-6, and draft-7 documents.

The library expects the `$schema` property for the document to be set in order to understand the input format. By default, if no other inputs are detected, it defaults to `JSON Schema draft 7`. The process of interpreting a JSON Schema to a model can be read [here](./interpretation_of_JSON_Schema.md).

## Generate models from Swagger 2.0 documents

There are one way to generate models from a Swagger 2.0 document

- [Generate from a pure JS object](../examples/swagger2.0-from-object)

The Swagger input processor expects that the property `swagger` is defined in order to know it should be processed.

The response payload and `body` parameters, since it is a JSON Schema variant, is [interpreted as a such](./interpretation_of_JSON_Schema.md).

## Generate models from OpenAPI documents

There are one way to generate models from an OpenAPI document

- [Generate from a pure JS object](../examples/openapi-from-object)

The OpenAPI input processor expects that the property `openapi` is defined in order to know it should be processed.

The response and request payloads, since it is a JSON Schema variant, is [interpreted as a such](./interpretation_of_JSON_Schema.md).

## Generate models from TypeScript type files

Currently, we support generating models from a TypeScript type file.

- [Generate Java model from a TypeScript file](../examples/java-from-typescript-type/)

The TypeScript input processor expects that the typescript file and base directory where it's present, is passed as input, in order to process the types accurately.

## Generate models from Meta models
Sometimes, the supported inputs such as AsyncAPI and JSON Schema wont be enough for your use-case and you want to create your own data models while still utilizing the full sweep of features from the generators.

Check out this [example out for a live demonstration](../examples/meta-model).

## Generate models from OpenAPI documents

There are one way to generate models from an OpenAPI document

- [Generate from a pure JS object](../examples/openapi-from-object)

The OpenAPI input processor expects that the property `openapi` is defined in order to know it should be processed.

The response and request payloads, since it is a JSON Schema variant, is [interpreted as a such](./interpretation_of_JSON_Schema.md).

## Generate Go models

Go is one of the many output languages we support. Check out this [basic example for a live demonstration](../examples/generate-go-models) and the following [Go documentation for more advanced use-cases](./languages/Go.md).

## Generate C# models

C# is one of the many output languages we support. Check out this [basic example for a live demonstration](../examples/generate-csharp-models) and the following [C# documentation for more advanced use-cases](./languages/Csharp.md).

## Generate Java models

Java is one of the many output languages we support. Check out this [basic example for a live demonstration](../examples/generate-java-models) and the following [Java documentation for more advanced use-cases](./languages/Java.md).

## Generate TypeScript models

TypeScript is one of the many output languages we support. Check out this [basic example for a live demonstration](../examples/generate-typescript-models) and the following [TypeScript documentation for more advanced use-cases](./languages/TypeScript.md).

## Generate JavaScript models

JavaScript is one of the many output languages we support. Check out this [basic example for a live demonstration](../examples/generate-javascript-models) and the following [JavaScript documentation for more advanced use-cases](./languages/JavaScript.md).

## Generate Dart models

Dart is one of the many output languages we support. Check out this [basic example for a live demonstration](../examples/generate-dart-models) and the following [Dart documentation for more advanced use-cases](./languages/Dart.md).

## Generate Rust models

Rust is one of the many output languages we support. Check out this [basic example for a live demonstration](../examples/generate-rust-crate) and the following [Rust documentation for more advanced use-cases](./languages/Rust.md).

## Generate Python models

Python is one of the many output languages we support. Check out this [basic example for a live demonstration](../examples/generate-python-models) and the following [Python documentation for more advanced use-cases](./languages/Python.md).
