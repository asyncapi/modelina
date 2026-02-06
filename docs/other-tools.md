# Migrating from other tools

This document is to help you keep an overview of of the differences between Modelina and other code generation tools, to better get an introduction to Modelina based on your current knowledge.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [jsonschema2pojo (v1)](#jsonschema2pojo-v1)
- [QuickType](#quicktype)

<!-- tocstop -->

## jsonschema2pojo (v1)

Website: https://www.jsonschema2pojo.org/ <br></br>
GitHub: https://github.com/joelittlejohn/jsonschema2pojo <br></br>
Supported inputs: JSON/YAML and JSON Schema <br></br>
Written in: Java <br></br>

Here is some of the noticeable differences with Modelina that is nice to know before jumping into it:

1. Modelina does not care much about the input, and support a range of them with no real limitation. I.e. supporting AsyncAPI, OpenAPI, ..., etc, see [supported inputs for more information](../README.md#features).
2. Modelina does not care about output language, i.e. it's not only Java that is supported, see the full list of [supported outputs here](../README.md#features).
3. Modelina does not hardcode specific features such as serialization libraries i.e. Jackson, Gson, ..., or validation annotations. Instead we use [presets](./presets.md) to control what is being generated to never be limited by hardcoding. Read more about which [serialization libraries we support for Java here](./languages/Java.md#generate-serializer-and-deserializer-functionality).
4. Modelina does not care which types you want generated (primitive types, long integers, etc), this can be [controlled by the constrainer](https://github.com/asyncapi/modelina/blob/master/docs/constraints/README.md). Read more about how to [change the type mapping](./constraints/README.md#type-mapping).
5. Modelina is part of Linux Foundation and is therefore a neutral ground for collaboration.


## QuickType

TBD