# Usages

Modelina can be used in many different contexts and has many features, all depending on the output language. This document will walk you through you the library's basic usages.

For more advanced use-cases, please check out the [advanced document](./advanced.md).

For more specific integration options, please check out the [integration document](./integration.md).

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Generator's options](#generators-options)
- [Understanding the output format](#understanding-the-output-format)
- [Generate models from AsyncAPI documents](#generate-models-from-asyncapi-documents)
  * [Limitations and Compatibility](#limitations-and-compatibility)
    + [Polymorphism](#polymorphism)
- [Generate models from JSON Schema documents](#generate-models-from-json-schema-documents)
- [Generate models from Avro Schema documents](#generate-models-from-avro-schema-documents)
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
- [Generate Python models](#generate-python-models)
- [Generate Kotlin models](#generate-kotlin-models)
- [Generate C++ (cplusplus) models](#generate-c-cplusplus-models)
- [Generate PHP models](#generate-php-models)
- [Generate Scala models](#generate-scala-models)

<!-- tocstop -->

## Generator's options

For Modelina, there exist 3 types of options for the generation process.
1. Default options, are the default options the rest overwrite.
2. Generator options, are used as the baseline options used for each model rendering, unless otherwise specified.
3. Render options, are the last options to specify before the rendering of a model, this is used to specialize the options for individual rendering of a model.

Generator options are passed as the first argument to the generator's constructor. Check the example:

```ts
const generator = new TypeScriptGenerator({ ...options });
```

Render options are passed as the first argument to the generator's render function. Check the example:

```ts
const generator = ...
generator.render(model, inputModel, { ...options });

```

## Understanding the output format

The output format is designed for you to use the generated models in further contexts. It might be part of a larger code generation such as AsyncAPI templates. This means that you can glue multiple models together into one large file, or split it out as you see fit.

All `generate` functions return an array of `OutputModel`s, which contains the following properties.

| Property | Type | Description |
|---|---|---|
| `result` | String | The rendered content, that depends on whether you render it as a full model or partial model. |
| `model` | [ConstrainedMetaModel](./internal-model.md#the-constrained-meta-model) | The constrained meta model that contains many other information about the rendered model. |
| `modelName` | String | The rendered name of the model. |
| `inputModel` | `InputMetaModel` | Contains all the raw models along side the input they where generated for. Check the code for further information. |
| `dependencies` | String[] | List of rendered dependency imports that the model uses. |

## Generate models from AsyncAPI documents

When providing an AsyncAPI document, the library iterates the entire document and generate models for all defined message payloads. The message payloads are interpreted based on the schema format. 

For JSON Schema it follows the [JSON Schema input processing](#generate-models-from-json-schema-documents).

There are two ways to generate models for an AsyncAPI document.

- [Generate from a parsed AsyncAPI 2.x document](../examples/asyncapi-from-parser)
- [Generate from a parsed AsyncAPI 2.x document, from the old v1 parser](../examples/asyncapi-from-v1-parser)
- [Generate from an AsyncAPI 2.x JS object](../examples/asyncapi-from-object)

The message payloads, regardless of schemaFormat, are converted to a JSON Schema variant and is [interpreted as a such](./inputs/JSON_Schema.md).

### Limitations and Compatibility
These are the current known limitation of the AsyncAPI input.

#### Polymorphism

Through the AsyncAPI Schema you are able to use `discriminator` for achieving polymorphism. Current version of Modelina does not generate the expected inheritance of models, instead it's current behavior is to [merge the schemas together](./inputs/JSON_Schema.md#processing-sub-schemas). This means you will still get access to the properties that missing inherited model has, but without the inheritance.

Long term if this is something you wish was supported, voice your [opinion here](https://github.com/asyncapi/modelina/issues/108).

## Generate models from JSON Schema documents

There are three ways to generate models for a JSON Schema document.

- [Generate from a JSON Schema draft 7 JS object](../examples/json-schema-draft7-from-object)
- [Generate from a JSON Schema draft 6 JS object](../examples/json-schema-draft6-from-object)
- [Generate from a JSON Schema draft 4 JS object](../examples/json-schema-draft4-from-object)

The library expects the `$schema` property for the document to be set in order to understand the input format. By default, if no other inputs are detected, it defaults to `JSON Schema draft 7`. The process of interpreting a JSON Schema to a model can be read [here](./inputs/JSON_Schema.md).

## Generate models from Avro Schema documents

See the below example to get started with Avro Schema for generating models.

- [Generate from an Avro Schema JS Object](../examples/avro-schema-from-object)

The Avro input processor expects the `name` and `type` property, as per [Avro Schema specs](https://avro.apache.org/docs/1.11.1/specification/#schema-declaration), in the input object in order to proceed successfully.

> Note: Currently, we do not have a support for `map`, `fixed` and `byte` data type. It would be introduced soon.

## Generate models from Swagger 2.0 documents

There are one way to generate models from a Swagger 2.0 document.

- [Generate from a Swagger 2.0 JS object](../examples/swagger2.0-from-object)

The Swagger input processor expects that the property `swagger` is defined in order to know it should be processed.

The response payload and `body` parameters, since it is a JSON Schema variant, is [interpreted as a such](./inputs/JSON_Schema.md).

### Limitations and Compatibility
These are the current known limitation of the Swagger 2.0 input.

#### Polymorphism

Through the Swagger 2.0 Schema you are able to use `discriminator` for achieving polymorphism. Current version of Modelina does not generate the expected inheritance of models, instead it's current behavior is to [merge the schemas together](./inputs/JSON_Schema.md#processing-sub-schemas). This means you will still get access to the properties that missing inherited model has, but without the inheritance.

Long term if this is something you wish was supported, voice your [opinion here](https://github.com/asyncapi/modelina/issues/108).

## Generate models from OpenAPI documents

There are one way to generate models from an OpenAPI document

- [Generate from OpenAPI 3.0 JS object](../examples/openapi-from-object)
- [Generate from OpenAPI 3.1 JS object](../examples/openapi-v3_1-from-object)
- [Generate from OpenAPI components](../examples/openapi-include-components)

The OpenAPI input processor expects that the property `openapi` is defined in order to know it should be processed.

The response and request payloads, since it is a JSON Schema variant, is [interpreted as a such](./inputs/JSON_Schema.md).

#### Limitations and Compatibility
These are the current known limitation of the OpenAPI inputs.

##### Polymorphism

Through the OpenAPI 3.0 Schema you are able to use `discriminator` for achieving polymorphism. Current version of Modelina does not generate the expected inheritance of models, instead it's current behavior is to [merge the schemas together](./inputs/JSON_Schema.md#processing-sub-schemas). This means you will still get access to the properties that missing inherited model has, but without the inheritance.

Long term if this is something you wish was supported, voice your [opinion here](https://github.com/asyncapi/modelina/issues/108).

## Generate models from TypeScript type files

Currently, we support generating models from a TypeScript type file.

- [Generate Java model from a TypeScript file](../examples/java-from-typescript-type/)

The TypeScript input processor expects that the typescript file and base directory where it's present, is passed as input, in order to process the types accurately. The input processor converts the TypeScript types into JSON Schema, which are then passed on to the [JSON Schema processor](#generate-models-from-json-schema-documents). 

## Generate models from Meta models
Sometimes, the supported inputs such as AsyncAPI and JSON Schema wont be enough for your use-case and you want to create your own data models while still utilizing the full sweep of features from the generators.

You can do that by providing the [internal meta model](./internal-model.md#the-meta-model) as input. Check out this [example out for a live demonstration](../examples/meta-model).

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

Rust is one of the many output languages we support. Check out this [basic example for a live demonstration](../examples/rust-generate-crate) and the following [Rust documentation for more advanced use-cases](./languages/Rust.md).

## Generate Python models

Python is one of the many output languages we support. Check out this [basic example for a live demonstration](../examples/generate-python-models) and the following [Python documentation for more advanced use-cases](./languages/Python.md).

## Generate Kotlin models

Kotlin is one of the many output languages we support. Check out this [basic example for a live demonstration](../examples/generate-kotlin-models) as well as [how to generate enums](../examples/generate-kotlin-enums) and the following [Kotlin documentation for more advanced use-cases](./languages/Kotlin.md).

## Generate C++ (cplusplus) models

C++ is one of the many output languages we support. Check out this [basic example for a live demonstration](../examples/generate-cplusplus-models) and the following [C++ documentation for more advanced use-cases](./languages/Cplusplus.md).

## Generate PHP models

PHP is one of the many output languages we support. Check out this [basic example for a live demonstration](../examples/generate-php-models/) and the following [PHP documentation for more advanced use-cases](./languages/Php.md).

## Generate Scala models

Scala is one of the many output languages we support. Check out this [basic example for a live demonstration](../examples/generate-scala-models/) and the following [Scala documentation for more advanced use-cases](./languages/Scala.md).