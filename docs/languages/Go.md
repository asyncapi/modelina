# Go
There are special use-cases that each language supports; this document pertains to **Go models**.

<!-- toc is generated with GitHub Actions do not remove toc markers -->
<!-- toc -->

- [Go](#go)
  - [Generate serializer and deserializer functionality](#generate-serializer-and-deserializer-functionality)
    - [To and from JSON](#to-and-from-json)
      - [JSON Tags](#json-tags)
    - [To and from XML](#to-and-from-xml)
    - [To and from binary](#to-and-from-binary)
  - [Rendering comments from description and example fields](#rendering-comments-from-description-and-example-fields)
  - [Optional pointers and date-time fields](#optional-pointers-and-date-time-fields)

<!-- tocstop -->

## Generate serializer and deserializer functionality

The most widely used use-case for Modelina is to generate models that include serialization and deserialization functionality to convert the models into payload data. This payload data can of course be many different kinds, JSON, XML, raw binary, you name it.

As you normally only need one library to do this, we developers can never get enough with creating new stuff, therefore there might be one specific library you need or want to integrate with. Therefore there is not one specific preset that offers everything. Below is a list of all the supported serialization presets. 

### To and from JSON
Here are all the supported presets and the libraries they use for converting to and from JSON:

- [JSON Tags](#json-tags)

#### JSON Tags

To generate go models that work correctly with JSON marshal functions we need to generate appropriate JSON `struct-tags`, use the preset `GO_COMMON_PRESET` and provide the option `addJsonTag: true` (added in CLI by default).

check out this [example for a live demonstration](../../examples/go-json-tags/)

### To and from XML
Currently not supported, [let everyone know you need it](https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md)!

### To and from binary
Currently not supported, [let everyone know you need it](https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md)!

## Rendering comments from description and example fields

You can use the `GO_DESCRIPTION_PRESET` to generate comments from description fields in your model.

See [this example](../../examples/generate-go-asyncapi-comments) for how this can be used.

## Optional pointers and date-time fields

The Go generator keeps its existing output by default. You can opt in to pointer types for optional primitive, enum, object, and reference fields, and map JSON Schema `string` fields with `format: date-time` to Go's `time.Time` type:

```ts
const generator = new GoGenerator({
  usePointersForOptionalFields: true,
  useTimeForDateTime: true
});
```

With both options enabled, an optional `date-time` property is rendered as `*time.Time`. The generated complete model automatically imports Go's `time` package. Required fields remain value types, and other string formats remain strings. Slices, maps, and interfaces remain unchanged because they are already nil-capable in Go.

The same options are available in the Modelina CLI and AsyncAPI CLI through `--goUsePointersForOptionalFields` and `--goUseTimeForDateTime`.
