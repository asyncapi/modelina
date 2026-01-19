# Rust

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Language Features](#language-features)
- [Generator Features](#generator-features)
- [Implement `new`](#implement-new)
- [Implement `Default` for enums](#implement-default-for-enums)
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
