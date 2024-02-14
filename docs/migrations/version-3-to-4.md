# Migration from v3 to v4
This document contain all the breaking changes and migrations guidelines for adapting your code to the new version.

## Fixed edge cases for camel case names

Naming such as object properties using camel case formatting had an edge case where if they contained a number followed by an underscore and a letter it would be incorrectly formatted. This has been fixed in this version, which might mean properties, model names, etc that use camel case might be renamed. 

This example contains such a string:

```yaml
type: object
properties:
  aa_00_testAttribute:
    type: string
```

This used to generate:

```ts
interface AnonymousSchema_1 {
  aa_00TestAttribute?: string;
}
```

but will now generate:

```ts
interface AnonymousSchema_1 {
  aa_00_testAttribute?: string;
}
```