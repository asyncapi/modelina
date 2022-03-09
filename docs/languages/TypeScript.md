# TypeScript

There are special use-cases that each language supports; this document pertains to **TypeScript models**.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Generate an interface instead of classes](#generate-an-interface-instead-of-classes)
- [Generate union types instead of enums](#generate-union-types-instead-of-enums)
- [Generate un/marshal functions for classes](#generate-unmarshal-functions-for-classes)
- [Generate example data function](#generate-example-data-function)
- [Rendering complete models to a specific module system](#rendering-complete-models-to-a-specific-module-system)
- [Rendering comments from description and example fields](#rendering-comments-from-description-and-example-fields)

<!-- tocstop -->

## Generate an interface instead of classes

Sometimes you don't care about classes, but rather have interfaces generated. This can be changed through the [modelType configuration](https://github.com/asyncapi/modelina/blob/master/docs/generators.md#typescript).

Check out this [example out for a live demonstration](../../examples/typescript-interface).

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

## Generate un/marshal functions for classes

Sometimes you want to use the models for data transfers, and while most cases would work out of the box, custom serializer functionality is needed for the advanced cases. If you generated the data models based on a JSON Schema document and you want the serialized data to validate against the schema, this functionality is REQUIRED.

This can be done by including the preset `TS_COMMON_PRESET` using the option `marshalling`.

Check out this [example out for a live demonstration](../../examples/typescript-generate-marshalling).

## Generate example data function

You might stumble upon a user case (we had one in code generation) where you want a simple example instance of the generated data model.

This can be done by including the preset `TS_COMMON_PRESET` using the option `example`.

Check out this [example out for a live demonstration](../../examples/typescript-generate-example).


## Rendering complete models to a specific module system
In some cases you might need to render the complete models to a specific module system such as ESM and CJS.

Check out this [example for a live demonstration how to generate the complete TypeScript models to use ESM module system](../../examples/typescript-use-esm).

Check out this [example for a live demonstration how to generate the complete TypeScript models to use CJS module system](../../examples/typescript-use-cjs).

## Rendering comments from description and example fields
You can use the `TS_DESCRIPTION_PRESET` to generate JSDoc style comments from description and example fields in your model.

See [this example](../../examples/typescript-generate-comments) for how this can be used.