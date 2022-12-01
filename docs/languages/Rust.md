# Rust

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Language Features](#language-features)
- [Generator Features](#generator-features)
- [Implement `new`](#implement-new)
- [Implement `default`](#implement-default)
- [Implement `From<String> (serde_json)`](#implement-from_json_string)
- [Implement `Into<String> (serde_json)`](#implement-to_json_stringn)
- [Implement `From<FramedByteStream> (tokio_serde)`](#implement-from-framed-byte-stream)
- [Implement `Into<FramedByteStream> (tokio_serde)`](#implement-into-framed-byte-stream)
<!-- tocstop -->

## Language Features

Generated code depends on the following Cargo features:

- derive
- alloc

## Generator Features


| **Feature**                  | **Status**    | **Info**                                                                              |
|------------------------------|---------------|---------------------------------------------------------------------------------------|
| Union (polymorphic type)     | ✅ done        |                                                                                       |
| Enum (group of constants)    | ✅ done        |                                                                                       |
| Array (unordered collection) | ✅ done        |                                                                                       |
| Tuple (ordered collection)   |  ✅ done       |                                                                                       |


## Implement `new`

To generate a `new` method, use the preset `RUST_COMMON_PRESET` and provide the option `implementNew: true`.

## Implement `Default` for enums

To generate `Default` implementation for enums that provide a default value, use the preset `RUST_COMMON_PRESET` and provide the option `implementDefault: true`.

## Implement `From<String>` (serde_json)

TODO

## Implement `Into<String>` (serde_json)

TODO

## Implement `From<FramedByteStream>` (tokio_serde)

TODO

## Implement `From<FramedByteStream>` (tokio_serde)

TOOO

## Generate serializer and deserializer functionality

The most widely used usecase for Modelina is to generate models that include serilization and deserialization functionality to convert the models into payload data. This payload data can of course be many different kinds, JSON, XML, raw binary, you name it.

As you normally only need one library to do this, we developers can never get enough with creating new stuff, therefore there might be one specific library you need or want to integrate with. Therefore there is not one specific preset that offers everything. Below is a list of all the supported serialization presets. 

### To and from JSON
Here are all the supported presets and the libraries they use for converting to and from JSON: 

- [Generate models with serde](#generate-models-with-serde) 

#### Generate models with serde

Using the preset `RUST_SERDE_PRESET`, renders serde annotation.

Check out this [example out for a live demonstration](../../examples/rust-generate-serde/).

### To and from XML
Currently not supported, [let everyone know you need it](https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md)!

### To and from binary
Currently not supported, [let everyone know you need it](https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md)!