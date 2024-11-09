# Advanced use-cases for Modelina

This document contains many of the advanced use-cases that you may stumble upon when pushing the limits of Modelina.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Generate each model in the same file](#generate-each-model-in-the-same-file)
- [Generate models to separate files](#generate-models-to-separate-files)
- [Include a custom function in the data model](#include-a-custom-function-in-the-data-model)
- [Use the models for data transfer](#use-the-models-for-data-transfer)
- [Adapting input and outputs](#adapting-input-and-outputs)
- [Add logging to library](#add-logging-to-library)
- [Change the generated indentation type and size](#change-the-generated-indentation-type-and-size)
- [Change the type mapping](#change-the-type-mapping)
- [Changing the constrain rules](#changing-the-constrain-rules)
- [Customizing the interpreter options](#customizing-the-interpreter-options)

<!-- tocstop -->

## Generate each model in the same file

This example shows us how to generate each model in the same file

Check out this [example out for a live demonstration](../examples/generate-all-models-within-the-same-file).

## Generate models to separate files

The standard generator only allows you to generate the raw models which you can implement your own logic for generating the models to separate files. We have however create simple wrapper generators to use.

The reason for splitting the functionality is because in certain environments (like pure front-end application), generating to a file is not needed.

The file generators all follow the same pattern regardless of output language, which is the following format - `<language>FileGenerator`.

> It is not supported in browsers.

Check out this [example out for a live demonstration](../examples/generate-to-files).

## Include a custom function in the data model

Sometimes you want to include custom functionality into the generated models, this can be done through a custom preset using the hook `additionalContent`.

Check out this [example out for a live demonstration](../examples/include-custom-function).

## Use the models for data transfer

One of the primary use-cases for the generated models, is to serialize and deserilize it to for example JSON, XML or binary. Each generator can have multiple ways to achieve this, and even support multiple libraries. This is achieved through presets, you can find them here for each output:

- [C++](./languages/Cplusplus.md#generate-serializer-and-deserializer-functionality)
- [C#](./languages/Csharp.md#generate-serializer-and-deserializer-functionality)
- [Dart](./languages/Dart.md#generate-serializer-and-deserializer-functionality)
- [Go](./languages/Go.md#generate-serializer-and-deserializer-functionality)
- [Java](./languages/Java.md#generate-serializer-and-deserializer-functionality)
- [JavaScript](./languages/JavaScript.md#generate-serializer-and-deserializer-functionality)
- [Kotlin](./languages/Kotlin.md#generate-serializer-and-deserializer-functionality)
- [PHP](./languages/Php.md#generate-serializer-and-deserializer-functionality)
- [Python](./languages/Python.md#generate-serializer-and-deserializer-functionality)
- [Rust](./languages/Rust.md)
- [Scala](./languages/Scala.md#generate-serializer-and-deserializer-functionality)
- [TypeScript](./languages/TypeScript.md#generate-serializer-and-deserializer-functionality)

## Adapting input and outputs

Sometimes you simply cannot make two things work together as you wished, maybe the input does not support it, or Modelina natively doesn't. However, because of the nature with presets, we can make it work anyway.

> With great customization comes a great responsibility. Always make sure to raise your issue before trying workarounds, maybe you are not alone in the problem, and it should be natively supported, so please make your due diligence before venturing into this :pray: And always feel free to reach out on the AsyncAPI slack channel if you want some quicker feedback!

Check out this [example for a demonstration of how to adapt the input and out to a specific use-case](../examples/adapting-input-and-output).

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

Sometimes, the default type mapping simply dont use the types you expected, or fit into your use-case. Thats why the entire mapping from [MetaModels](./internal-model.md#the-meta-model) to constrained types can be altered.

Check out this [example out for a live demonstration](../examples/change-type-mapping).

## Changing the constrain rules

When moving from a [MetaModel](./internal-model.md#the-meta-model) to a [ConstrainedMetaModel](./internal-model.md#the-constrained-meta-model) it means we bind the input to a specific output. That output has specific constraints that the input MUST adhere to, [read more about this here](constraints/README.md).

There can be multiple reasons why you want to change the default constrain rules, and therefore you can form them to your needs.

Check out this [example out for a live demonstration](../examples/overwrite-default-constraint/) for how to overwrite the default constraints.

Check out this [example out for a live demonstration](../examples/overwrite-naming-formatting/) for how to overwrite the naming formatting for models.

## Customizing the interpreter options

According to JSON schema draft 7, if `additionalProperties` or `additionalItems` are omitted, their default value is `true`. The `Interpreter` honors this behavior, however this creates more loose models that might not be the intention for the developer. 

We suggest not using this option if it can be avoided, as it limits your generated models to include any additional properties, and would simply be ignored. Instead adapt your schemas to be more strict by setting these keywords to `false`. This option should really only be used when you have no control over your input and the output is unintended.

To set the interpreter up to ignore the default behavior, you can further restrict your models with the following options:
- `ignoreAdditionalProperties` - if set, it ensures that `additionalProperties` by default is ignored.
- `ignoreAdditionalItems` - if set, it ensures that `additionalItems` by default is ignored.

Check out this [example out for a live demonstration](../examples/passing-interpreter-options/) for how to customize the behavior of `additionalProperties`.
