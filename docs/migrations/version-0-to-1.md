# Migration from v0 to v1
This document contain all the breaking changes and migrations guidelines for adapting your code to the new version.

## Naming conventions have been removed
In version 0, you where able to control the naming formats for properties and model through the option `namingConvention`. 

This is now removed and replaced with `constraints` which is a mean to simplify the complex task of constraining any type of values to the specifics of an output. Each output has their unique constraints to what is allowed and what is expected as names for properties, models and enums, and enum values.

To read more about the constrain option here:
- [C#](https://github.com/asyncapi/modelina/blob/master/docs/constraints/CSharp.md)
- [Dart](https://github.com/asyncapi/modelina/blob/master/docs/constraints/Dart.md)
- [Go](https://github.com/asyncapi/modelina/blob/master/docs/constraints/Go.md)
- [Java](https://github.com/asyncapi/modelina/blob/master/docs/constraints/Java.md)
- [JavaScript](https://github.com/asyncapi/modelina/blob/master/docs/constraints/JavaScript.md)
- [Rust](https://github.com/asyncapi/modelina/blob/master/docs/constraints/Rust.md)

## CommonModel is no more (almost)
As part of version 1, the previous core model was called `CommonModel` and was a dynamic class which could take the form of any type of model. I.e. one moment it could be defining an object, the next an enum, or multiple at a time. This made it extremely hard to use in the generators, read more about why we decided to change it here: https://github.com/asyncapi/modelina/pull/530

This change means that any time you did some custom presets and interacted with `CommonModel`, you now interact with a variant of [ConstrainedMetaModel](https://github.com/asyncapi/modelina/blob/master/docs/internal-model.md#the-constrained-meta-model).

The CommonModel is still being used for the dynamic input processing of JSON Schema.

### Preset hooks
These are all the preset hook changes:
- Java, class preset hooks had access to `model: CommonModel` which has now been changed to `model: ConstrainedObjectModel`
- Java, enum preset hooks had access to `model: CommonModel` which has now been changed to `model: ConstrainedEnumModel`
- JavaScript, class preset hooks had access to `model: CommonModel` which has now been changed to `model: ConstrainedObjectModel`
- TypeScript, class preset hooks had access to `model: CommonModel` which has now been changed to `model: ConstrainedObjectModel`
- TypeScript, Interface preset hooks had access to `model: CommonModel` which has now been changed to `model: ConstrainedObjectModel`
- TypeScript, enum preset hooks had access to `model: CommonModel` which has now been changed to `model: ConstrainedEnumModel`
- TypeScript, type preset hooks had access to `model: CommonModel` which has now been changed to `model: ConstrainedMetaModel`

General changes:
- Hooks that gave access to properties/fields formally had the arguments `property`, `propertyName` and `type`, these are now wrapped within the [`ConstrainedObjectPropertyModel`](https://github.com/asyncapi/modelina/blob/master/docs/internal-model.md#the-constrained-meta-model) and can be accessed through the `property` argument.
- Hooks that gave access to enum items, now has the type [`ConstrainedEnumValueModel`](https://github.com/asyncapi/modelina/blob/master/docs/internal-model.md#the-constrained-meta-model).

## TypeScript and JavaScript module system
In the previous version you only had to define a the module system type (`ESM` or `CJS`) when generating complete models. However, it happens that presets need to import their own dependencies which then need to adapt to the desire module system. Therefore this option have been moved so you have to adapt your code the following way:

```ts
const input = ...;

// Old way
const generator = new JavaScriptGenerator();
const models = await generator.generateCompleteModels(input, {
  moduleSystem: 'ESM'
})

// New way
const generator = new JavaScriptGenerator({moduleSystem: 'ESM'});
const models = await generator.generateCompleteModels(input, {});

```