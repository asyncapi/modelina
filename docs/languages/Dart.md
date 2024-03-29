# Dart
There are special use-cases that each language supports; this document pertains to **Dart models**.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Generate serializer and deserializer functionality](#generate-serializer-and-deserializer-functionality)
  * [To and from JSON](#to-and-from-json)
    + [JSON annotation](#json-annotation)
  * [To and from XML](#to-and-from-xml)
  * [To and from binary](#to-and-from-binary)

<!-- tocstop -->

## Generate serializer and deserializer functionality

The most widely used usecase for Modelina is to generate models that include serilization and deserialization functionality to convert the models into payload data. This payload data can of course be many different kinds, JSON, XML, raw binary, you name it.

As you normally only need one library to do this, we developers can never get enough with creating new stuff, therefore there might be one specific library you need or want to integrate with. Therefore there is not one specific preset that offers everything. Below is a list of all the supported serialization presets. 

### To and from JSON
Here are all the supported presets and the libraries they use: 

- [JSON annotation](#json-annotation) 

#### JSON annotation

When you generate the models with json annotation, generated files include json_annotation package (https://pub.dev/packages/json_annotation/) and their syntax. 

Check out this [example for a live demonstration](../../examples/dart-generate-json-annotation).

### To and from XML
Currently not supported, [let everyone know you need it](https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md)!

### To and from binary
Currently not supported, [let everyone know you need it](https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md)!
