# Constraints
Because we cannot control what is provided as input, we must constrain the internal model to be valid for the output ([read more about the process here](./processing.md)). What is considered valid entirely depends on the output so each have their own set of rules.

As an example lets consider TypeScript as an output. Consider the model name, which are a simple string, but a string which can contain ANY characters. Some of the constraints we have found for the naming of a model are:

- Only a section of special characters are allowed as name for a model. For example `&name` cannot be rendered as class name, because it is syntactically incorrect:
```ts
class &name {}
```
- Numbers may not be starting characters. For example `1Name` cannot be rendered as class name, because it is syntactically incorrect:
```ts
class 1name {}
```

There are many rules as such, to get the full description about them read further for each corresponding output:

- [TypeScript](./constraints/TypeScript.md)

# Customization
Even though there are many of these constraints, there might be reasons you want to customize the behavior to make it suit your use-case. Therefore each of the constraint rules can be overwritten completely and allow for you to implement your own behavior.

We define these as two types, either you only want to change part of the logic, or you want to overwrite the entire constraint logic.

See the following example how to overwrite the constraints:
- [Overwriting the formatter](../examples/overwrite-naming-formatting) and keep the rest of the constraints as is.
- [Overwriting the entire naming constraint logic](../examples/overwrite-naming-formatting) keeping none of the existing functionality which handles edge cases. It is recommended to **NOT** use this if it can be avoided, as you will limit yourself to what inputs can be generated to models. So make sure you know what you are doing :laughing: