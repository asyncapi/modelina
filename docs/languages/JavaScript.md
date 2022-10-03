# JavaScript
There are special use-cases that each language supports; this document pertains to **JavaScript models**.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Rendering complete models to a specific module system](#rendering-complete-models-to-a-specific-module-system)
- [Generate serializer and deserializer functionality](#generate-serializer-and-deserializer-functionality)
  * [To and from JSON](#to-and-from-json)
    + [Generate marshalling and unmarshalling functions](#generate-marshalling-and-unmarshalling-functions)
  * [To and from XML](#to-and-from-xml)
  * [To and from binary](#to-and-from-binary)
- [Generate example data function](#generate-example-data-function)

<!-- tocstop -->

## Rendering complete models to a specific module system
In some cases you might need to render the complete models to a specific module system such as ESM and CJS.

Check out this [example for a live demonstration how to generate the complete JavaScript models to use ESM module system](../../examples/javascript-use-esm).

Check out this [example for a live demonstration how to generate the complete JavaScript models to use CJS module system](../../examples/javascript-use-cjs).

## Generate serializer and deserializer functionality

The most widely used usecase for Modelina is to generate models that include serilization and deserialization functionality to convert the models into payload data. This payload data can of course be many different kinds, JSON, XML, raw binary, you name it.

As you normally only need one library to do this, we developers can never get enough with creating new stuff, therefore there might be one specific library you need or want to integrate with. Therefore there is not one specific preset that offers everything. Below is a list of all the supported serialization presets. 

### To and from JSON
Here are all the supported presets and the libraries they use: 

- [Generate marshalling and unmarshalling functions](#generate-marshalling-and-unmarshalling-functions) 

#### Generate marshalling and unmarshalling functions

Using the preset `JS_COMMON_PRESET` with the option `marshalling` to `true`, renders two function for the class models. One which convert the model to JSON and another which convert the model from JSON to an instance of the class.


Check out this [example out for a live demonstration](../../examples/javascript-generate-marshalling).

### To and from XML
Currently not supported, [let everyone know you need it](https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md)!

### To and from binary
Currently not supported, [let everyone know you need it](https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md)!

## Generate example data function

Generate example instance of the data model including the preset `JS_COMMON_PRESET` using the option `example`.

Check out this [example out for a live demonstration](../../examples/javascript-generate-example).
