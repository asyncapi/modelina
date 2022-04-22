# Advanced use-cases for Modelina
This document contains many of the advanced use-cases that you may stumble upon when pushing the limits of Modelina.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Generate each model in the same file](#generate-each-model-in-the-same-file)
- [Generate models to separate files](#generate-models-to-separate-files)
- [Include a custom function in the data model](#include-a-custom-function-in-the-data-model)
- [Use the models for data transfer](#use-the-models-for-data-transfer)
- [Extend the logic of an existing renderer](#extend-the-logic-of-an-existing-renderer)
- [Build your own model renderer](#build-your-own-model-renderer)
- [Add logging to library](#add-logging-to-library)
- [Change the generated indentation type and size](#change-the-generated-indentation-type-and-size)
- [Change the type mapping](#change-the-type-mapping)
- [Changing the constrain rules](#changing-the-constrain-rules)

<!-- tocstop -->

## Generate each model in the same file
TODO 

## Generate models to separate files

The standard generator only allows you to generate the raw models which you can implement your own logic for generating the models to separate files. We have however create simple wrapper generators to use.

The reason for splitting the functionality is because in certain environments (like pure front-end application), generating to a file is not needed.

The file generators all follow the same pattern regardless of output language, which is the following format - `<language>FileGenerator`.

Supported by:
- Java
- TypeScript
- C#
- Go
- JavaScript

> It is not supported in browsers.

Check out this [example out for a live demonstration](../examples/generate-to-files).

## Include a custom function in the data model
Sometimes you want to include custom functionality into the generated models, this can be done through a custom preset using the hook `additionalContent`.

Check out this [example out for a live demonstration](../examples/include-custom-function).

## Use the models for data transfer
TODO 

## Extend the logic of an existing renderer
TODO 

## Build your own model renderer
TODO 

## Add logging to library
When you generate models, by default, nothing is logged to the console or elsewhere.

If you want to integrate a logging implementation specific to your needs, this library allows you to implement a detached logging module.

The library uses 4 different logging levels:
- `debug`: for specific details only relevant to debugging
- `info`: for general information relevant to the user
- `warn`: for warnings a user may need if the output is not as expected
- `error`: for errors that occur in the library

Check out this [example out for a live demonstration](../examples/custom-logging).

## Change the generated indentation type and size
In some scenarios, depending on how you stitch them together, you might need to change the indentation type or size and both of these cases are fully supported.

Check out this [example out for a live demonstration](../examples/indentation-type-and-size).

## Change the type mapping
Sometimes, the default type mapping simply dont use the types you expected, or fit into your use-case. Thats why the entire mapping from [MetaModels](./processing.md#the-meta-model) to constrained types can be altered.

Check out this [example out for a live demonstration](../examples/change-type-mapping).

## Changing the constrain rules
When moving from a [MetaModel](./processing.md#the-meta-model) to a [ConstrainedMetaModel](./processing.md#the-constrained-meta-model) it means we bind the input to a specific output. That output has specific constraints that the input MUST adhere to, [read more about this here](constraints.md).

There can be multiple reasons why you want to change the default constrain rules, and therefore you can form them to your needs.

Check out this [example out for a live demonstration](../examples/overwrite-default-constraint/) for how to overwrite the default constraints.

Check out this [example out for a live demonstration](../examples/overwrite-naming-formatting/) for how to overwrite the naming formatting for models.
