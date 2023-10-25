# Examples

This directory contains a series of self-contained examples to help you get started or show how a specific feature can be utilized. The examples also serve the purpose of being part of the testing workflow to ensure they always work!

We love contributions and new examples that does not already exist, you can follow [this guide to contribute one](../docs/contributing.md#adding-examples)!

---

## Groups of Examples

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Input examples](#input-examples)
- [General examples](#general-examples)
- [Simple generator examples](#simple-generator-examples)
- [Integrations](#integrations)
- [Python](#python)
- [JavaScript](#javascript)
- [Java](#java)
- [C#](#c%23)
- [TypeScript](#typescript)
- [Kotlin](#kotlin)
- [PHP](#php)
- [Other examples](#other-examples)

<!-- tocstop -->

---

## Input examples
These examples show a specific input and how they can be used:
- [asyncapi-from-object](./asyncapi-from-object) - A basic example where an AsyncAPI JS object is used to generate models.
- [asyncapi-avro-schema](./asyncapi-avro-schema) - A basic example of how to use Modelina with an AsyncAPI document using AVRO 1.9 as schema format for the payload.
- [asyncapi-openapi-schema](./asyncapi-openapi-schema) - A basic example of how to use Modelina with an AsyncAPI document using OpenAPI 3.0 Schema for the payload.
- [asyncapi-raml-schema](./asyncapi-raml-schema) - A basic example of how to use Modelina with an AsyncAPI document using RAML 1.0 data types as payload format.
- [asyncapi-from-parser](./asyncapi-from-parser) - A basic example where an AsyncAPI JS object from the [parser-js](https://github.com/asyncapi/parser-js) is used to generate models.
- [asyncapi-from-v1-parser](./asyncapi-from-v1-parser) - A basic example where an AsyncAPI JS object from the old v1 [parser-js](https://github.com/asyncapi/parser-js) is used to generate models.
- [json-schema-draft7-from-object](./json-schema-draft7-from-object) - A basic example where a JSON Schema draft 7 JS object is used to generate models.
- [json-schema-draft6-from-object](./json-schema-draft6-from-object) - A basic example where a JSON Schema draft 6 JS object is used to generate models.
- [json-schema-draft4-from-object](./json-schema-draft4-from-object) - A basic example where a JSON Schema draft 4 JS object is used to generate models.
- [swagger2.0-from-object](./swagger2.0-from-object) - A basic example where a Swagger 2.0 JS object is used to generate models.
- [meta-model](./meta-model) - A basic example how to provide a meta model for the generator

## General examples
These are examples that can be applied in all scenarios.
- [include-custom-function](./include-custom-function) - A basic example where a custom function is included.
- [overwrite-naming-formatting](./overwrite-naming-formatting) - A basic example how to overwrite default naming format constraint in this case, overwriting returning a constant case format.
- [overwrite-default-constraint](./overwrite-default-constraint) -  A basic example how to overwrite the entire constraint logic and not just a single part of the default behavior, in this case overwriting the model naming constraint.
- [custom-logging](./custom-logging) - A basic example where a custom logger is used.
- [generate-to-files](./generate-to-files) - A basic example that shows how you can generate the models directly to files.
- [indentation-type-and-size](./indentation-type-and-size) - This example shows how to change the indentation type and size of the generated model.
- [change-type-mapping](./change-type-mapping) - A basic example showing how to change the type of a model in some context.
- [change-type-mapping-with-dependency](./change-type-mapping-with-dependency) - A basic example showing how to use the dependency manager to inject your own custom type with a dependency instead of the default type.

## Simple generator examples
These are all the basic generator examples that shows a bare minimal example of a generator:
- [generate-typescript-models](./generate-typescript-models) - A basic example to generate TypeScript data models
- [generate-csharp-models](./generate-csharp-models) - A basic example to generate C# data models
- [generate-python-models](./generate-python-models) - A basic example showing how to generate Python models.
- [rust-generate-crate](./rust-generate-crate) - A basic example showing how to generate a Rust package.
- [generate-java-models](./generate-java-models) - A basic example to generate Java data models.
- [generate-go-models](./generate-go-models) - A basic example to generate Go data models
- [generate-javascript-models](./generate-javascript-models) - A basic example to generate JavaScript data models
- [generate-kotlin-models](./generate-kotlin-models) - A basic example to generate Kotlin data models
- [generate-cplusplus-models](./generate-cplusplus-models) - A basic example to generate C++ data models

## Integrations
These are examples of how you can integrate Modelina into a specific scenario:
- [integrate-with-react](./integrate-with-react) - A basic example that shows how you can integrate Modelina with React.
- [integrate-with-next](./integrate-with-next) - A basic example that shows how you can integrate Modelina with Next.
- [integrate-modelina-into-maven](./integrate-modelina-into-maven) - A basic example that shows how you can integrate Modelina into the Java Maven build process.

## Python
These are all specific examples only relevant to the Python generator:
- [generate-python-pydantic-models](./generate-python-pydantic-models) - An example showing how to generate Python pydantic models.
- [python-generate-json-serializer-and-deseriazlier](./python-generate-json-serializer-and-deserializer) - An example that shows how to generate the models with JSON serializer and deserializer.

## JavaScript
These are all specific examples only relevant to the JavaScript generator:
- [javascript-use-esm](./javascript-use-esm) - A basic example that generate the models to use ESM module system.
- [javascript-use-cjs](./javascript-use-cjs) - A basic example that generate the models to use CJS module system.
- [javascript-generate-marshalling](./javascript-generate-marshalling) - A basic example of how to use the un/marshalling functionality of the javascript class.
- [javascript-generate-example](./javascript-generate-example) - A basic example of how to use Modelina and output a JavaScript class with an example function.

## Java
These are all specific examples only relevant to the Java generator:
- [java-generate-tostring](./java-generate-tostring) - A basic example that shows how to generate models that overwrite the `toString` method
- [java-change-collection-type](./java-change-collection-type) - An example to render collections as List in Java.
- [java-generate-hashcode](./java-generate-hashcode) - A basic example that shows how to generate models that overwrite the `hashCode` method
- [java-from-typescript-type](./java-from-typescript-type) - A basic example that shows how to generate a Java model from a TypeScript type input file.
- [java-generate-marshalling](./java-generate-marshalling) - A basic example of how to use the un/marshalling functionality of the java class.
- [java-from-typescript-type-with-options](./java-from-typescript-type-with-options) - A basic example that shows how to generate a Java model from a TypeScript type input file along with user provided options.
- [java-generate-equals](./java-generate-equals) - A basic example that shows how to generate models that overwrite the `equal` method
- [java-generate-javax-constraint-annotation](./java-generate-javax-constraint-annotation) - A basic example that shows how Java data models having `javax.validation.constraints` annotations can be generated.
- [java-generate-javadoc](./java-generate-javadoc) - A basic example of how to generate Java models including JavaDocs.
- [integrate-modelina-into-maven](./integrate-modelina-into-maven/) - A basic example that shows how you can integrate Modelina into the Java Maven build process.

## C#
These are all specific examples only relevant to the C# generator:
- [csharp-generate-equals-and-hashcode](./csharp-generate-equals-and-hashcode) - A basic example on how to generate models that overwrite the `Equal` and `GetHashCode` methods
- [csharp-generate-json-serializer](./csharp-generate-json-serializer) - A basic example on how to generate models that include function to serialize the data models to and from JSON with System.Text.Json.
- [csharp-generate-newtonsoft-serializer](./csharp-generate-newtonsoft-serializer) - A basic example on how to generate models that include function to serialize the data models to and form JSON with Newtonsoft.
- [csharp-overwrite-enum-naming](./csharp-overwrite-enum-naming) - A basic example on how to generate enum value names.
- [csharp-use-inheritance](./csharp-use-inheritance) - A basic example that shows how to introduce inheritance to classes 
- [csharp-generate-records](./csharp-generate-records) - A basic example that shows how to change C# model type from class to record.
- [csharp-generate-handle-nullable](./csharp-generate-handle-nullable) - A basic example that shows how generate code than handles nullable mode and prevent warnings.

## TypeScript
These are all specific examples only relevant to the TypeScript generator:
- [typescript-interface](./typescript-interface) - A basic TypeScript generator that outputs interfaces.
- [typescript-enum-type](./typescript-enum-type) - A basic example of how to use Modelina can output different types of enums in TypeScript.
- [typescript-generate-example](./typescript-generate-example) - A basic example of how to use Modelina and output a TypeScript class with an example function.
- [typescript-generate-marshalling](./typescript-generate-marshalling) - A basic example of how to use the un/marshalling functionality of the typescript class.
- [typescript-generate-comments](./typescript-generate-comments) - A basic example of how to generate TypeScript interfaces with comments from description and example fields.
- [typescript-use-esm](./typescript-use-esm) - A basic example that generate the models to use ESM module system.
- [typescript-use-cjs](./typescript-use-cjs) - A basic example that generate the models to use CJS module system.
- [typescript-generate-jsonbinpack](./typescript-generate-jsonbinpack) - A basic example showing how to generate models that include [jsonbinpack](https://github.com/sourcemeta/jsonbinpack) functionality.

## Kotlin
These are all specific examples only relevant to the Kotlin generator:
- [generate-kotlin-enums](./generate-kotlin-enums)
- [kotlin-generate-kdoc](./kotlin-generate-kdoc)
- [kotlin-generate-javax-constraint-annotations](./kotlin-generate-javax-constraint-annotation)
- [kotlin-change-collection-type](./kotlin-change-collection-type)

## PHP
These are all specific examples only relevant to the PHP generator:
- [php-generate-models](./php-generate-models) - A basic example of how to use Modelina and output a PHP class.
- [php-generate-complete-models](./php-generate-complete-models) - An example that will output PHP complete class with dependencies and headers.
- [php-generate-documentation-preset](./php-generate-documentation-preset) - An example that will output PHP complete class with documentation.

## Other examples
Miscellaneous examples that do not fit into the otherwise grouping.
- [TEMPLATE](./TEMPLATE) - A basic template used to create new examples.
