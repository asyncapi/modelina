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
