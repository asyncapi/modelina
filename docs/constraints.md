# Constraints
Because we cannot control what is provided as input, we must constrain the internal model to be valid for the output ([read more about the process here](./processing.md)). What is considered valid entirely depends on the output so each have their own set of rules.

As an example lets consider TypeScript output.

The `name` of the model MUST adhere to the following constraints:
- Only a section of special characters are allowed as name for a model. For example `&name` cannot be rendered as class name, because it is syntactically incorrect:
```ts
class &name {}
```
However, as input it is completely fine to have (in most scenarios).
- Numbers may not be starting characters. For example `1Name` cannot be rendered as class name, because it is syntactically incorrect:
```ts
class 1name {}
```

There are many rules as such, to get the full description about them read further for each corresponding output:

- [TypeScript](./constraints/TypeScript.md)

# Customization
Even though there are many of these constraints, there might be reasons you want to customize the behavior to make it suit your use-case. 

Therefore each of the constraint rules can be overwritten completely and allow for you to implement your own behavior.

See the following example how to overwrite some of the constraints:
- [Overwriting MetaModel naming formatting](../examples/overwrite-naming-formatting)