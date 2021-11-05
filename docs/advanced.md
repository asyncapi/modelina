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
- [Create your own models from the ground up, instead of a supported input](#create-your-own-models-from-the-ground-up-instead-of-a-supported-input)
- [Add logging to library](#add-logging-to-library)
- [Change the generated indentation type and size](#change-the-generated-indentation-type-and-size)
- [Change the naming format for properties](#change-the-naming-format-for-properties)
- [Change the naming format for data models](#change-the-naming-format-for-data-models)

<!-- tocstop -->

## Property naming convention
Because property names of a data model might not fit the output language, there are multiple naming rules it by default adhere to, to provide full support. Not all problems necessarily exist for all output languages, but they are handled anyway. 

If you overwrite the default naming convention, you can of course decide not to support those use-cases. Checkout [change the naming format for properties](#change-the-naming-format-for-properties) for an example how to overwrite this.

The naming rules for properties are the following:
1. Property names cannot contain a number as the first character, such as `12Prop`, by default we prepend `number`.
1. Property names cannot be the same as the data model it belongs to, such as `{"$id": "PropClass", "properties": {"PropClass": {...}}`. By default we prepend `reserved`.
1. Property names cannot be reserved keyword names, such as `return` is reserved in for example TS. By default we prepend `reserved`.
1. Property names cannot contain special characters (including space ` `). By default we simply remove the special characters.
1. If any property is renamed, we must make sure that it does not clash with the already existing property name (say we prepend `number` to the property name when a number is first character). By default we prepend `reserved` if we encounter such a case. 

By default all names are formatted using a camel case format.

## Data model naming convention
Because data model names might not fit the output language, there are multiple naming rules it by default adhere to, to provide full support.

If you overwrite the default naming behavior, you can of course decide not to support those use-cases. Checkout [change the naming format for data models](#change-the-naming-format-for-data-models) for an example how to overwrite this.

1. Data model names cannot contain a number as the first character, such as `12Name`. By default we prepend `number`.
1. Data model names cannot be reserved keywords, such as `return` is reserved in for example TS. By default we prepend `reserved`.
1. Data model names cannot contains special cases (including space ` `). By default we simply remove the special characters.
1. If the data model is renamed, we must make sure that it does not clash with other existing existing data model names (say we prepend `number` to the property name when a number is first char). By default we prepend `reserved`.

By default all names are formatted using a pascal case format.

## Generate each model in the same file
TODO 

## Generate models to separate files

The standard generator only allows you to generate the raw models which you can implement your own logic for generating the models to separate files. We have however create simple wrapper generators to use.

The reason for splitting the functionality is because in certain environments (like pure front-end application), generating to a file is not needed.

The file generators all follow the same pattern regardless of output language, which is the following format - `<language>FileGenerator`.


Currently only supported for `Java`.

> Not support in browsers.

Check out this [example out for a live demonstration](../examples/generate-to-files).

## Include a custom function in the data model
TODO 

## Use the models for data transfer
TODO 

## Extend the logic of an existing renderer
TODO 

## Build your own model renderer
TODO 

## Create your own models from the ground up, instead of a supported input
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
TODO 

## Change the naming format for properties
TODO

## Change the naming format for data models
TODO