# C#
There are special use-cases that each language supports; this document pertains to **C# models**.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Generate serializer and deserializer functionality](#generate-serializer-and-deserializer-functionality)
- [Generate models with equals and GetHashCode methods](#generate-models-with-equals-and-gethashcode-methods)

<!-- tocstop -->

## Generate serializer and deserializer functionality
TODO

## Generate models with equals and GetHashCode methods
To overwrite the `Equal` and `GetHashCode` methods, use the preset `CSHARP_COMMON_PRESET` and provide the options `equal: true` and `hashCode: true`

Check out this [example for a live demonstration](../../examples/csharp-generate-equals-and-hashcode).