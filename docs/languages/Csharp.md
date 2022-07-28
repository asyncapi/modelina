# C#

There are special use-cases that each language supports; this document pertains to **C# models**.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [C#](#c)
  - [Generate serializer and deserializer functionality](#generate-serializer-and-deserializer-functionality)
  - [Generate models with equals and GetHashCode methods](#generate-models-with-equals-and-gethashcode-methods)
  - [Generate models with auto-implemented properties](#generate-models-with-auto-implemented-properties)
  - [Change the collection type for arrays](#change-the-collection-type-for-arrays)
  - [Generate custom enum value names](#generate-custom-enum-value-names)
  - [Generate models with inheritance](#generate-models-with-inheritance)
- [FAQ](#faq)
    - [Why is the type `dynamic` or `dynamic[]` when it should be `X`?](#why-is-the-type-dynamic-or-dynamic-when-it-should-be-x)

<!-- tocstop -->

## Generate serializer and deserializer functionality

Sometimes you want to serialize the data models into JSON. In order to do that use the preset `CSHARP_JSON_SERIALIZER_PRESET`

**External dependencies:**
Requires [System.Text.Json](https://devblogs.microsoft.com/dotnet/try-the-new-system-text-json-apis/), [System.Text.Json.Serialization](https://docs.microsoft.com/en-us/dotnet/standard/serialization/system-text-json-how-to?pivots=dotnet-6-0) and [System.Text.RegularExpressions](https://docs.microsoft.com/en-us/dotnet/api/system.text.regularexpressions?view=net-6.0) to work.

Check out this [example for a live demonstration](../../examples/csharp-generate-serializer).

## Generate models with equals and GetHashCode methods

To overwrite the `Equal` and `GetHashCode` methods, use the preset `CSHARP_COMMON_PRESET` and provide the options `equal: true` and `hashCode: true`

Check out this [example for a live demonstration](../../examples/csharp-generate-equals-and-hashcode).

## Generate models with auto-implemented properties

To generate auto-implemented properties (the ones with with `{ get; set; }` accessors), use the preset `CSHARP_COMMON_PRESET` and provide the option `autoImplementedProperties: true`

Check out this [example for a live demonstration](../../examples/csharp-auto-implemented-properties).

## Change the collection type for arrays

If you consider the Array Class to be insuitable for your situation, then you might look into setting the `collectionType: 'List'` option to your instance of the generator. This will cause all of the collections to be rendered as of type `System.Collections.Generic.IEnumerable<T>`.

Check out this [example for a live demonstration](../../examples/csharp-change-collection-type).

## Generate custom enum value names

When using AsyncAPI or JSON Schema, it is not possible to associate enum names with values however with extensions it is. 

Check out this [example for a live demonstration](../../examples/csharp-overwrite-enum-naming/).

## Generate models with inheritance

If you want the generated models to inherit from a custom class, you can overwrite the existing rendering behavior and create your own class setup.

Check out this [example for a live demonstration](../../examples/csharp-use-inheritance).

# FAQ
This is the most asked questions and answers which should be your GOTO list to check before asking anywhere else. Cause it might already have been answered!

### Why is the type `dynamic` or `dynamic[]` when it should be `X`? 
Often times you might encounter variables which as of type `dynamic` or `dynamic[]`, which is our fallback type when we cannot accurately find the right type.

**If you are encountering this when your input is JSON Schema/OpenAPI/AsyncAPI**, it most likely is because of a property being defined as having multiple types (union or tuple) which the C# generator cannot natively handle and fallback to `dynamic`. For arrays, you have to remember that `additionalItems` is by default `true`, this means that even though you say `items: { type: "string"}` by not setting `additionalItems: false`, it's the same as setting `items: { type: ["array", "boolean", "integer", "null", "number", "object", "string"]}`. 