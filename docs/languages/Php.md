# PHP
There are special use-cases that each language supports; this document pertains to **PHP models**.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Description Present](#description-present)
- [Generate serializer and deserializer functionality](#generate-serializer-and-deserializer-functionality)
  * [To and from JSON](#to-and-from-json)
    + [Generate json_encode function](#generate-json_encode-function)
  * [To and from XML](#to-and-from-xml)
  * [To and from binary](#to-and-from-binary)

<!-- tocstop -->

## Description Present

By default, descriptions are not rendered for the model; you can change that by applying `PHP_DESCRIPTION_PRESET`.

Check out this [example for a live demonstration](../../examples/php-generate-documentation-preset).

## Generate serializer and deserializer functionality

The most widely used usecase for Modelina is to generate models that include serialization and deserialization functionality to convert the models into payload data.
This payload data can, of course, be many different kinds, JSON, XML, raw binary, you name it.

As you normally only need one library to do this, we developers can never get enough of creating new stuff, therefore, there might be one specific library you need or want to integrate with.
Therefore, there is not one specific preset that offers everything. Below is a list of all the supported serialization presets. 

### To and from JSON

Here are all the supported presets and the libraries they use for converting to and from JSON: 

- [Generate json_encode function](#generate-json_encode-function) 

#### Generate json_encode function

Objects in PHP can generally be serialized to JSON using the [`json_encode()` function](https://www.php.net/manual/en/function.json-encode.php).
To ensure that the data is serialized correctly, the [`JsonSerializable` interface](https://www.php.net/manual/en/class.jsonserializable.php) needs to be implemented.
This will ensure that, for example, enum values and property names are serialized correctly.

To add support of serialization to JSON, apply the `PHP_JSON_SERIALIZABLE_PRESET` preset.
Check out this [example for a live demonstration](../../examples/php-generate-json-serializable-preset).


### To and from XML

Currently not supported, [let everyone know you need it](https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md)!

### To and from binary

Currently not supported, [let everyone know you need it](https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md)!
