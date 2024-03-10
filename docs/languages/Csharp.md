# C#

There are special use-cases that each language supports; this document pertains to **C# models**.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

  * [Generate serializer and deserializer functionality](#generate-serializer-and-deserializer-functionality)
    + [To and from JSON](#to-and-from-json)
      - [Using native System.Text.Json](#using-native-systemtextjson)
      - [Using Newtonsoft/Json.NET](#using-newtonsoftjsonnet)
    + [To and from XML](#to-and-from-xml)
    + [To and from binary](#to-and-from-binary)
  * [Generate models with equals and GetHashCode methods](#generate-models-with-equals-and-gethashcode-methods)
  * [Generate models with auto-implemented properties](#generate-models-with-auto-implemented-properties)
  * [Change the collection type for arrays](#change-the-collection-type-for-arrays)
  * [Generate custom enum value names](#generate-custom-enum-value-names)
  * [Generate models with inheritance](#generate-models-with-inheritance)
  * [Generate models as records](#generate-models-as-records)
  * [Generate code that handles nullable mode](#generate-code-that-handles-nullable-mode)
- [FAQ](#faq)
    + [Why is the type `dynamic` or `dynamic[]` when it should be `X`?](#why-is-the-type-dynamic-or-dynamic-when-it-should-be-x)

<!-- tocstop -->

## Generate serializer and deserializer functionality

The most widely used usecase for Modelina is to generate models that include serilization and deserialization functionality to convert the models into payload data. This payload data can of course be many different kinds, JSON, XML, raw binary, you name it.

As you normally only need one library to do this, we developers can never get enough with creating new stuff, therefore there might be one specific library you need or want to integrate with. Therefore there is not one specific preset that offers everything. Below is a list of all the supported serialization presets. 

### To and from JSON
Here are all the supported presets and the libraries they use: 

- [Using native System.Text.Json](#using-native-systemtextjson) 

#### Using native System.Text.Json 

To include functionality that convert the models using the [System.Text.Json](https://devblogs.microsoft.com/dotnet/try-the-new-system-text-json-apis/), to use this, use the preset `CSHARP_JSON_SERIALIZER_PRESET`.

Check out this [example for a live demonstration](../../examples/csharp-generate-json-serializer).

**External dependencies**
Requires [System.Text.Json](https://devblogs.microsoft.com/dotnet/try-the-new-system-text-json-apis/), [System.Text.Json.Serialization](https://docs.microsoft.com/en-us/dotnet/standard/serialization/system-text-json-how-to?pivots=dotnet-6-0), [System.Text.RegularExpressions](https://docs.microsoft.com/en-us/dotnet/api/system.text.regularexpressions?view=net-6.0) and [Microsoft.CSharp version 4.7](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/configure-language-version) to work.

#### Using Newtonsoft/Json.NET

To include functionality that convert the models using the [Newtonsoft/Json.NET](https://www.newtonsoft.com/json) framework, to use this, use the preset `CSHARP_NEWTONSOFT_SERIALIZER_PRESET`.

Check out this [example for a live demonstration](../../examples/csharp-generate-newtonsoft-serializer).

**External dependencies**
Requires [`Newtonsoft.Json`, `Newtonsoft.Json.Linq`](https://www.newtonsoft.com/json) and [System.Collections.Generic](https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic?view=net-7.0).

### To and from XML
Currently not supported, [let everyone know you need it](https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md)!

### To and from binary
Currently not supported, [let everyone know you need it](https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md)!

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

Check out this [example for a live demonstration](../../examples/csharp-overwrite-enum-naming).

## Generate models with inheritance

If you want the generated models to inherit from a custom class, you can overwrite the existing rendering behavior and create your own class setup.

Check out this [example for a live demonstration](../../examples/csharp-generate-json-serializer).


## Generate models as records 

Since C# 9 the language now supports records as an alternative to classes suitable for roles like DTO's. Modelina can generate records by setting the `modelType: record` option. Note that this renderer does not support the `autoImplementedProperties` option as this is default with records. 

Check out this [example for a live demonstration](../../examples/csharp-use-inheritance).

## Generate code that handles nullable mode

Since C# 8 the language now supports nullable reference types. Modelina can generate code that handles nullable mode by setting the `handleNullable: true` option.
If your project use nullable, you should set this parameter to `true` to avoid warnings.

Check out this [example for a live demonstration](../../examples/csharp-generate-handle-nullable).

# FAQ
This is the most asked questions and answers which should be your GOTO list to check before asking anywhere else. Cause it might already have been answered!

### Why is the type `dynamic` or `dynamic[]` when it should be `X`? 
Often times you might encounter variables which as of type `dynamic` or `dynamic[]`, which is our fallback type when we cannot accurately find the right type.

**If you are encountering this when your input is JSON Schema/OpenAPI/AsyncAPI**, it most likely is because of a property being defined as having multiple types as a union, which the C# generator cannot natively handle and fallback to `dynamic`.