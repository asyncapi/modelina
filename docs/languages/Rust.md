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
| additionalProperties         | ⚠️ partial    | Available as HashMap at root document level. Nested properties are not yet supported. |
| patternProperties            | ⛔ not started | PatternProperties are omitted from generated code                                     |


## Implement `new`

To generate a `new` method, use the preset `RUST_COMMON_PRESET` and provide the option `implementNew: true`

```rust
#[derive(Clone, Debug, Deserialize, PartialEq, Serialize)]
pub struct Address {
    #[serde(rename="street_name")]
    street_name: String,
    #[serde(rename="city")]
    city: String,
    #[serde(rename="state")]
    state: String,
    #[serde(rename="house_number")]
    house_number: f64,
    #[serde(rename="marriage", skip_serializing_if = "Option::is_none")]
    marriage: Option<bool>,
    #[serde(rename="members", skip_serializing_if = "Option::is_none")]
    members: Option<Box<crate::Members>>,
    #[serde(rename="tuple_type", skip_serializing_if = "Option::is_none")]
    tuple_type: Option<Box<crate::TupleType>>,
    #[serde(rename="array_type")]
    array_type: Vec<String>,
    #[serde(rename="additionalProperties", skip_serializing_if = "Option::is_none")]
    additional_properties: Option<std::collections::HashMap<String, String>>,
}

impl Address {
    pub fn new(street_name: String, city: String, state: String, house_number: f64, marriage: Option<bool>, members: Option<crate::Members>, tuple_type: Option<crate::TupleType>, array_type: Vec<String>, additional_properties: Option<std::collections::HashMap<String, String>>) -> Address {
        Address {
        street_name,
        city,
        state,
        house_number,
        marriage,
        members: members.map(Box::new),
        tuple_type: tuple_type.map(Box::new),
        array_type,
        additional_properties,
        }
    }
}
```

## Implement `Default` for enums

To generate `Default` implementation for enums that provide a default value, use the preset `RUST_COMMON_PRESET` and provide the option `implementDefault: true`


```rust
#[derive(Clone, Copy, Debug, Deserialize, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize)]
pub enum EnumType {
    #[serde(rename="Texas")]
    Texas,
    #[serde(rename="Alabama")]
    Alabama,
    #[serde(rename="California")]
    California,
}
impl Default for EnumType {
    fn default() -> EnumType {
        EnumType::California
    }
}
```

## Implement `From<String>` (serde_json)

TODO

## Implement `Into<String>` (serde_json)

TODO

## Implement `From<FramedByteStream>` (tokio_serde)

TODO

## [Implement `From<FramedByteStream>` (tokio_serde)

TOOD