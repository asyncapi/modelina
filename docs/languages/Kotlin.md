# Kotlin

There are special use cases that each language supports; this document pertains to **Kotlin models**.

Since `data classes` are used for every model that has properties, there is no need for additional settings or 
features to generate `toString()`, `equals()`, `hashCode()`,  getters or setters.

Classes without properties are depicted by usual `classes`, they get no `toString()`, `equals()`, or `hashCode()`
implementation. The default one should suffice here.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Include KDoc for properties](#include-kdoc-for-properties)
- [Change the collection type for arrays](#change-the-collection-type-for-arrays)
- [Generate all AsyncAPI component schemas](#generate-all-asyncapi-component-schemas)
- [Map custom string formats](#map-custom-string-formats)
- [Use explicit enum constant names](#use-explicit-enum-constant-names)
- [Generate inherited and polymorphic models](#generate-inherited-and-polymorphic-models)
- [Omit implicit additional properties](#omit-implicit-additional-properties)
- [Render required properties first](#render-required-properties-first)
- [Include Javax validation constraint annotations for properties](#include-javax-validation-constraint-annotations-for-properties)
- [Generate serializer and deserializer functionality](#generate-serializer-and-deserializer-functionality)
  * [To and from JSON](#to-and-from-json)
  * [To and from XML](#to-and-from-xml)
  * [To and from binary](#to-and-from-binary)
<!-- tocstop -->

## Include KDoc for properties
To generate models containing `KDoc` from description and examples, use the `KOTLIN_DESCRIPTION_PRESET` option.

Check out this [example for a live demonstration](../../examples/kotlin-generate-kdoc).

## Change the collection type for arrays

Sometimes, we might want to render a different collection type, and instead of the default `Array` use it as a `List` type. To do so, provide the option `collectionType: 'List'`.

Check out this [example for a live demonstration](../../examples/kotlin-change-collection-type).

## Generate all AsyncAPI component schemas

By default, Modelina generates schemas reachable from message payloads. To also generate standalone or currently unreferenced schemas from `components/schemas`, enable `includeComponentSchemas`:

```ts
const generator = new KotlinGenerator({
  processorOptions: {
    asyncapi: {
      includeComponentSchemas: true
    }
  }
});
```

Use `--kotlinIncludeComponentSchemas` to enable the same behavior from the Modelina or AsyncAPI CLI.

## Map custom string formats

The Kotlin generator API supports custom type mappings. The CLI exposes string format mappings through repeatable `--kotlinTypeMapping` options:

```sh
asyncapi generate models kotlin asyncapi.yaml \
  --packageName com.example \
  --kotlinTypeMapping uuid=java.util.UUID \
  --kotlinTypeMapping instant=java.time.Instant \
  --kotlinTypeMapping zoned-date-time=java.time.ZonedDateTime
```

Unconfigured formats continue to use the Kotlin generator's default mappings.

## Use explicit enum constant names

Use `x-enum-varnames` to provide one generated constant name for each enum value:

```yaml
type: string
enum:
  - New York
  - California
x-enum-varnames:
  - NY
  - GOLDEN_STATE
```

Modelina still applies Kotlin identifier safety rules to the supplied names. If the extension is missing or invalid, names continue to be derived from the enum values.

## Generate inherited and polymorphic models

Enable JSON Schema inheritance to render inherited object schemas as Kotlin interfaces and implementations:

```ts
const generator = new KotlinGenerator({
  presets: [KOTLIN_JACKSON_PRESET],
  processorOptions: {
    jsonSchema: {
      allowInheritance: true
    }
  }
});
```

With the Jackson preset enabled, AsyncAPI discriminators generate `@JsonTypeInfo` and `@JsonSubTypes` metadata. `x-discriminator-mapping` is honored when it maps wire values to component schema references.

Use `--kotlinAllowInheritance` with the Modelina or AsyncAPI CLI.

## Omit implicit additional properties

Use the existing JSON Schema processor option `ignoreAdditionalProperties` when generated Kotlin models should not contain an implicit `additionalProperties` map. The CLI exposes it as `--kotlinIgnoreAdditionalProperties`.

## Render required properties first

Set `requiredPropertiesFirst: true` to place required constructor properties before optional properties while preserving the original order within both groups. The CLI exposes this option as `--kotlinRequiredPropertiesFirst`.

## Include Javax validation constraint annotations for properties

In some cases, when you generate the models from JSON Schema, you may want to include `javax.validation.constraint` annotations.

Check out this [example for a live demonstration](../../examples/kotlin-generate-javax-constraint-annotation).

## Generate serializer and deserializer functionality

The most widely used use case for Modelina is to generate models that include serialization and deserialization functionality to convert the models into payload data. This payload data can of course be many kinds, JSON, XML, raw binary, you name it.

As you normally only need one library to do this, we developers can never get enough with creating new stuff, therefore there might be one specific library you need or want to integrate with. Therefore, there is not one specific preset that offers everything. Below is a list of all the supported serialization presets.

### To and from JSON
Here are all the supported presets and the libraries they use:

- [Jackson annotation](#jackson-annotation)

#### Jackson annotation

To generate Kotlin data models with Jackson annotations, use the `KOTLIN_JACKSON_PRESET` option.

Check out this [example for a live demonstration](../../examples/kotlin-generate-jackson).

**External dependencies**
Requires [com.fasterxml.jackson.annotation](https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-annotations) to work.

### To and from XML
Currently not supported, [let everyone know you need it](https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md)!

### To and from binary
Currently not supported, [let everyone know you need it](https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md)!
