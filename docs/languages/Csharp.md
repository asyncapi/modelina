# C#

There are special use-cases that each language supports; this document pertains to **C# models**.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Generate serializer and deserializer functionality](#generate-serializer-and-deserializer-functionality)
- [Generate models with equals and GetHashCode methods](#generate-models-with-equals-and-gethashcode-methods)

<!-- tocstop -->

## Generate serializer and deserializer functionality

Sometimes you want to serialize the data models into JSON. In order to do that use the preset `CSHARP_JSON_SERIALIZER_PRESET`

**External dependencies:**
Requires [System.Text.Json](https://devblogs.microsoft.com/dotnet/try-the-new-system-text-json-apis/), [System.Text.Json.Serialization](https://docs.microsoft.com/en-us/dotnet/standard/serialization/system-text-json-how-to?pivots=dotnet-6-0) and [System.Text.RegularExpressions](https://docs.microsoft.com/en-us/dotnet/api/system.text.regularexpressions?view=net-6.0) to work.

Check out this [example for a live demonstration](../../examples/csharp-generate-serializer).

## Generate models with equals and GetHashCode methods

To overwrite the `Equal` and `GetHashCode` methods, use the preset `CSHARP_COMMON_PRESET` and provide the options `equal: true` and `hashCode: true`

Check out this [example for a live demonstration](../../examples/csharp-generate-equals-and-hashcode).
