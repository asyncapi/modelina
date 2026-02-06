# Rust

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Language Features](#language-features)
- [Generator Features](#generator-features)
- [Implement `new`](#implement-new)
- [Implement `default`](#implement-default)
- Implement `From<String> (serde_json)`
- Implement `Into<String> (serde_json)`
- Implement `From<FramedByteStream> (tokio_serde)`
- Implement `Into<FramedByteStream> (tokio_serde)`
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
| Tuple (ordered collection)   | ✅ done        |                                                                                       |


## Implement `new`

To generate a `new` method, use the preset `RUST_COMMON_PRESET` and provide the option `implementNew: true`.

## Implement `Default` for enums

To generate `Default` implementation for enums that provide a default value, use the preset `RUST_COMMON_PRESET` and provide the option `implementDefault: true`.

## Implement `From<String> (serde_json)`

To generate `From<String>` implementation for converting from JSON strings, use the preset `RUST_SERDE_PRESET` and provide the option `fromJson: true`.

```rust
use serde::{Deserialize, Serialize};
use std::str::FromStr;

impl<T> From<String> for T
where
    T: Deserialize,
{
    fn from_str(s: &str) -> Result<Self, T::Error> {
        T::deserialize(s)
    }
}
```

## Implement `Into<String> (serde_json)`

To generate `Into<String>` implementation for converting to JSON strings, use the preset `RUST_SERDE_PRESET` and provide the option `toJson: true`.

```rust
use serde::{Serialize};
use std::string::ToString;

impl<T> Into<String> for T
where
    T: Serialize,
{
    fn into(self) -> String {
        serde_json::to_string(&self)
    }
}
```

## Implement `From<FramedByteStream> (tokio_serde)`

To generate `From<FramedByteStream>` implementation for converting from framed byte streams, use the preset `RUST_TOKIO_PRESET` and provide the option `fromFramedByteStream: true`.

```rust
use bytes::Bytes;
use futures::StreamExt;
use serde::Deserialize;
use tokio::io::{AsyncReadExt, BufReader};
use tokio_util::codec::{FramedRead, FramedWrite};

impl<T> From<FramedByteStream> for T
where
    T: Deserialize,
{
    async fn from_framed_byte_stream(
        stream: impl Stream<Item = Result<Bytes, std::io::Error>>,
    ) -> Result<Self, Box<dyn std::error::Error + Send + Sync>> {
        let mut reader = BufReader::new(stream);
        let mut buffer = Vec::new();
        
        while let Some(chunk) = reader.next().await {
            let chunk = chunk?;
            buffer.extend_from_slice(&chunk);
        }
        
        let json_str = String::from_utf8(&buffer)?;
        T::deserialize(&json_str).map_err(Into::into)
    }
}
```

## Implement `Into<FramedByteStream> (tokio_serde)`

To generate `Into<FramedByteStream>` implementation for converting to framed byte streams, use the preset `RUST_TOKIO_PRESET` and provide the option `toFramedByteStream: true`.

```rust
use bytes::Bytes;
use futures::SinkExt;
use serde::Serialize;
use tokio::io::BufWriter;
use tokio_util::codec::{FramedRead, FramedWrite};

impl<T> Into<FramedByteStream> for T
where
    T: Serialize,
{
    async fn into_framed_byte_stream(
        self,
        mut writer: impl Sink<Item = Result<Bytes, Box<dyn std::error::Error + Send + Sync>>,
    ) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let json_str = serde_json::to_string(&self)?;
        let mut writer = BufWriter::new(writer);
        
        writer.write_all(json_str.as_bytes()).await?;
        writer.close().await?;
        
        Ok(())
    }
}
```
