# TypeScript
There are special use-cases that each language supports; this document pertains to **TypeScript models**.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Generate an interface instead of classes](#generate-an-interface-instead-of-classes)
- [Generate union types instead of enums](#generate-union-types-instead-of-enums)
- [Generate un/marshal functions for classes](#generate-unmarshal-functions-for-classes)
- [Generate example data function](#generate-example-data-function)

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

TODO

## Generate example data function

TODO
