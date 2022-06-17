# Constraints
Because we cannot control what is provided as input, we must constrain the internal model to be valid for the output ([read more about the process here](./internal-model.md)). What is considered valid entirely depends on the output so each have their own set of rules.

As an example lets consider TypeScript as an output. Consider the model name, which are a simple string, but a string which can contain ANY characters and formats. Some of the constraints we have found for the naming of a model are:

- Only a section of special characters are allowed as name for a model. For example `&name` cannot be rendered as class name, because it is syntactically incorrect:
```ts
class &name {}
```
- Numbers may not be starting characters. For example `1Name` cannot be rendered as class name, because it is syntactically incorrect:
```ts
class 1name {}
```
## Naming constraints
There are many rules as such, to get the full description about them read further for each corresponding output:

- [TypeScript](./constraints/TypeScript.md)


## Enum value constraints


## Type mapping
To make it easier to use the [ConstrainedMetaModels]() in presets and generators, we need to figure out the types for each model. This is to enable you to access the types from a property rather then calling a function. This is especially relevant because Modelina cannot fit all use-cases out of the box, and we therefore strive to make it tailorable to what ever your needs may be. The type mapping is one of those things that enable you to fine tune the types without having to rewrite presets from scratch.

The type mapping is part of the constrain process.



# Customization
Even though there are many of these constraints, there might be reasons you want to customize the behavior to make it suit your use-case. Therefore each of the constraint rules can be overwritten completely and allow for you to implement your own behavior.

We define these as two types, either you only want to change part of the logic, or you want to overwrite the entire constraint logic.

See the following example how to overwrite the different constraints:
- [Overwriting the formatter](../examples/overwrite-naming-formatting) and keep the rest of the constraints as is.
- [Overwriting the entire naming constraint logic](../examples/overwrite-naming-formatting) keeping none of the existing functionality which handles edge cases. It is recommended to **NOT** use this if it can be avoided, as you will limit yourself to what inputs can be generated to models. So make sure you know what you are doing :laughing:
- [Change the type mapping](../examples/change-type-mapping/) 