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

## Include Javax validation constraint annotations for properties

In some cases, when you generate the models from JSON Schema, you may want to include `javax.validation.constraint` annotations.

Check out this [example for a live demonstration](../../examples/kotlin-generate-javax-constraint-annotation).

## Generate serializer and deserializer functionality

The most widely used use case for Modelina is to generate models that include serialization and deserialization functionality to convert the models into payload data. This payload data can of course be many kinds, JSON, XML, raw binary, you name it.

As you normally only need one library to do this, we developers can never get enough with creating new stuff, therefore there might be one specific library you need or want to integrate with. Therefore, there is not one specific preset that offers everything. Below is a list of all the supported serialization presets.

### To and from JSON
Currently not supported, [let everyone know you need it](https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md)!

### To and from XML
Currently not supported, [let everyone know you need it](https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md)!

### To and from binary
Currently not supported, [let everyone know you need it](https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md)!
