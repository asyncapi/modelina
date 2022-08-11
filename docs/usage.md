# Usages

Modelina can be used in many different contexts and has many features, all depending on the output language. This document will walk you through you the library's basic usages.

For more advanced use-cases, please check out the [advanced document](./advanced.md).

For more specific integration options, please check out the [integration document](./integration.md).

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Understanding the output format](#understanding-the-output-format)
- [Generate models from AsyncAPI documents](#generate-models-from-asyncapi-documents)
  * [Limitations and Compatibility](#limitations-and-compatibility)
    + [Message Schema formats](#message-schema-formats)
    + [Polymorphism](#polymorphism)
- [Generate models from JSON Schema documents](#generate-models-from-json-schema-documents)
- [Generate models from Swagger 2.0 documents](#generate-models-from-swagger-20-documents)
  * [Limitations and Compatibility](#limitations-and-compatibility-1)
    + [Polymorphism](#polymorphism-1)
- [Generate models from OpenAPI documents](#generate-models-from-openapi-documents)
    + [Limitations and Compatibility](#limitations-and-compatibility-2)
      - [Polymorphism](#polymorphism-2)
- [Generate models from TypeScript type files](#generate-models-from-typescript-type-files)
- [Generate models from Meta models](#generate-models-from-meta-models)
- [Generate Go models](#generate-go-models)
- [Generate C# models](#generate-c%23-models)
- [Generate Java models](#generate-java-models)
- [Generate TypeScript models](#generate-typescript-models)
- [Generate JavaScript models](#generate-javascript-models)
- [Generate Dart models](#generate-dart-models)
- [Generate Rust models](#generate-rust-models)

<!-- tocstop -->

## Understanding the output format

The output format is designed for you to use the generated models in further contexts. It might be part of a larger code generation such as AsyncAPI templates. This means that you can glue multiple models together into one large file, or split it out as you see fit.

## Generate models from AsyncAPI documents

When providing an AsyncAPI document, the library iterates the entire document and generate models for all defined message payloads. The message payloads are interpreted based on the schema format. 

For JSON Schema it follows the [JSON Schema input processing](#generate-models-from-json-schema-documents).

There are two ways to generate models for an AsyncAPI document.

- [Generate from a parsed AsyncAPI document](../examples/asyncapi-from-parser)
- [Generate from a pure JS object](../examples/asyncapi-from-object)

The library expects the `asyncapi` property for the document to be set in order to understand the input format.

### Limitations and Compatibility
These are the current known limitation of the AsyncAPI input.

#### Message Schema formats
Currently, only a limited number of schema formats are supported and we currently rely on the [AsyncAPI parser](github.com/asyncapi/parser-js/) to handle those schema formats and convert them into [AsyncAPI Schema format](https://github.com/asyncapi/parser-js/#custom-message-parsers). At some point in the future, Modelina will support all native schema formats, so it does not matter which standard you use to define the message payloads, you will be able to generate models from it.

#### Polymorphism

Through the AsyncAPI Schema you are able to use `discriminator` for achieving polymorphism. Current version of Modelina does not generate the expected inheritance of models, instead it's current behavior is to [merge the schemas together](./inputs/interpretation_of_JSON_Schema.md#Processing-sub-schemas). This means you will still get access to the properties that missing inherited model has, but without the inheritance.

Long term if this is something you wish was supported, voice your [opionion here](https://github.com/asyncapi/modelina/issues/108).

## Generate models from JSON Schema documents

There is one way to generate models for a JSON Schema document.

- [Generate from a pure JS object](../examples/json-schema-draft7-from-object)

The library expects the `$schema` property for the document to be set in order to understand the input format. By default, if no other inputs are detected, it defaults to `JSON Schema draft 7`. The process of interpreting a JSON Schema to a model can be read [here](./interpretation_of_JSON_Schema.md).

## Generate models from Swagger 2.0 documents

There are one way to generate models from a Swagger 2.0 document

- [Generate from a JS object](../examples/swagger2.0-from-object)

The Swagger input processor expects that the property `swagger` is defined in order to know it should be processed.

The response payload and `body` parameters, since it is a JSON Schema variant, is [interpreted as a such](./interpretation_of_JSON_Schema.md).

### Limitations and Compatibility
These are the current known limitation of the Swagger 2.0 input.

#### Polymorphism

Through the Swagger 2.0 Schema you are able to use `discriminator` for achieving polymorphism. Current version of Modelina does not generate the expected inheritance of models, instead it's current behavior is to [merge the schemas together](./inputs/interpretation_of_JSON_Schema.md#Processing-sub-schemas). This means you will still get access to the properties that missing inherited model has, but without the inheritance.

Long term if this is something you wish was supported, voice your [opionion here](https://github.com/asyncapi/modelina/issues/108).

## Generate models from OpenAPI documents

There are one way to generate models from an OpenAPI document

- [Generate from OpenAPI 3.0 JS object](../examples/openapi-from-object)

The OpenAPI input processor expects that the property `openapi` is defined in order to know it should be processed.

The response and request payloads, since it is a JSON Schema variant, is [interpreted as a such](./interpretation_of_JSON_Schema.md).

#### Limitations and Compatibility
These are the current known limitation of the OpenAPI inputs.

##### Polymorphism

Through the OpenAPI 3.0 Schema you are able to use `discriminator` for achieving polymorphism. Current version of Modelina does not generate the expected inheritance of models, instead it's current behavior is to [merge the schemas together](./inputs/interpretation_of_JSON_Schema.md#Processing-sub-schemas). This means you will still get access to the properties that missing inherited model has, but without the inheritance.

Long term if this is something you wish was supported, voice your [opionion here](https://github.com/asyncapi/modelina/issues/108).

## Generate models from TypeScript type files

Currently, we support generating models from a TypeScript type file.

- [Generate Java model from a TypeScript file](../examples/java-from-typescript-type/)

The TypeScript input processor expects that the typescript file and base directory where it's present, is passed as input, in order to process the types accurately. The input processor converts the TypeScript types into JSON Schema, which is [interpreted as a such](./interpretation_of_JSON_Schema.md). 

## Generate models from Meta models
Sometimes, the supported inputs such as AsyncAPI and JSON Schema wont be enough for your use-case and you want to create your own data models while still utilizing the full sweep of features from the generators.

Check out this [example out for a live demonstration](../examples/meta-model).

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
