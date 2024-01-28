# TypeScript

There are special use-cases that each language supports; this document pertains to **TypeScript models**.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Generate an interface instead of classes](#generate-an-interface-instead-of-classes)
- [Generate different `mapType`s for an `object` type](#generate-different-maptypes-for-an-object)
- [Generate union types instead of enums](#generate-union-types-instead-of-enums)
- [Generate serializer and deserializer functionality](#generate-serializer-and-deserializer-functionality)
  * [To and from JSON](#to-and-from-json)
    + [Generate marshalling and unmarshalling functions](#generate-marshalling-and-unmarshalling-functions)
  * [To and from XML](#to-and-from-xml)
  * [To and from binary](#to-and-from-binary)
    + [Generate models with jsonbinpack support](#generate-models-with-jsonbinpack-support)
- [Generate example data function](#generate-example-data-function)
- [Rendering complete models to a specific module system](#rendering-complete-models-to-a-specific-module-system)
- [Rendering comments from description and example fields](#rendering-comments-from-description-and-example-fields)

<!-- tocstop -->

## Generate an interface instead of classes

Sometimes you don't care about classes, but rather have interfaces generated. This can be changed through the [modelType configuration](https://github.com/asyncapi/modelina/blob/master/docs/generators.md#typescript).

Check out this [example out for a live demonstration](../../examples/typescript-interface).

## Generate different `mapType`s for an `object`

Typescript offers different `mapType`s which can simplify the use based on the needs. This behavior can be changed through the [`mapType` configuration](https://github.com/asyncapi/modelina/blob/master/docs/generators.md#typescript).

- Use `map` when you need a dynamic collection of key-value pairs with built-in methods for manipulation.
- Use `record` when you want to define an object with specific keys and their corresponding value types.
- Use `indexedObject` (or an interface with index signature) for a more generic approach when working with objects with dynamic keys.

An example of the generated code can be seen below:

```ts
  // mapType = indexedObject
  private _person?: { [name: string]: any };

  // mapType = map
  private _person?: Map<string, any>;

  // mapType = record
    private _person?: Record<string, any>;
```

Also, check out this [example for a live demonstration](../../examples/typescript-change-map-type).

## Generate union types instead of enums

Typescript offers union types which can simplify the use as no keywords are needed and the values can be set directly. This behavior can be changed through the [modelType configuration](https://github.com/asyncapi/modelina/blob/master/docs/generators.md#typescript). An example of the generated code can be seen below:

```ts
// enumType = 'enum'
export enum Event = {
    PING: "ping",
    PONG: "pong"
};
// enumType = 'union'
export type Event = "ping" | "pong";
```

Check out this [example out for a live demonstration](../../examples/typescript-enum-type).

## Generate serializer and deserializer functionality

The most widely used usecase for Modelina is to generate models that include serilization and deserialization functionality to convert the models into payload data. This payload data can of course be many different kinds, JSON, XML, raw binary, you name it.

As you normally only need one library to do this, we developers can never get enough with creating new stuff, therefore there might be one specific library you need or want to integrate with. Therefore there is not one specific preset that offers everything. Below is a list of all the supported serialization presets. 

### To and from JSON
Here are all the supported presets and the libraries they use for converting to and from JSON: 

- [Generate marshalling and unmarshalling functions](#generate-marshalling-and-unmarshalling-functions) 

#### Generate marshalling and unmarshalling functions

Using the preset `TS_COMMON_PRESET` with the option `marshalling` to `true`, renders two function for the class models. One which convert the model to JSON and another which convert the model from JSON to an instance of the class.

Check out this [example out for a live demonstration](../../examples/typescript-generate-marshalling).

### To and from XML
Currently not supported, [let everyone know you need it](https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md)!

### To and from binary
Here are all the supported presets and the libraries they use for converting to and from binary: 

- [Generate jsonbinpack functions](#generate-models-with-jsonbinpack-support) 

#### Generate models with jsonbinpack support

This functionality is for the library [jsonbinpack](https://github.com/sourcemeta/jsonbinpack).

This preset can ONLY be used with AsyncAPI 2.x and JSON Schema draft 4 to 7 inputs.

This functionality has two requirements:
1. You MUST manually install the library `jsonbinpack`.
2. You MUST also use the [Generate un/marshal functions for classes](#generate-unmarshal-functions-for-classes)

This feature allows you to convert models to a buffer, which is highly space-efficient, instead of sending pure JSON data over the wire.

Check out this [example out for a live demonstration](../../examples/typescript-generate-jsonbinpack/).

## Generate example data function

You might stumble upon a user case (we had one in code generation) where you want a simple example instance of the generated data model.

This can be done by including the preset `TS_COMMON_PRESET` using the option `example`.

Check out this [example out for a live demonstration](../../examples/typescript-generate-example).

## Rendering complete models to a specific module system
In some cases you might need to render the complete models to a specific module system such as ESM and CJS.

You can choose between default exports and named exports when using either, with the `exportType` option.

Check out this [example for a live demonstration how to generate the complete TypeScript models to use ESM module system](../../examples/typescript-use-esm).

Check out this [example for a live demonstration how to generate the complete TypeScript models to use CJS module system](../../examples/typescript-use-cjs).

## Rendering comments from description and example fields
You can use the `TS_DESCRIPTION_PRESET` to generate JSDoc style comments from description and example fields in your model.

See [this example](../../examples/typescript-generate-comments) for how this can be used.