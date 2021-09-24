# Advanced use-cases for Modelina
This document contains many of the advanced use-cases that you may stumble upon when pushing the limits of Modelina.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Generate each model in the same file](#generate-each-model-in-the-same-file)
- [Generate a model in separate files](#generate-a-model-in-separate-files)
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

## Generate each model in the same file
TODO 

## Generate a model in separate files
TODO 

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
