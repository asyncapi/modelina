# Migration from v3 to v4
This document contain all the breaking changes and migrations guidelines for adapting your code to the new version.

## Property Naming changed for certain Edge Cases

Object properties were formatted wrong when they contained a number followed by an underscore and a letter.
This has been fixed in this version, which might means properties might be renamed. If you encounter errors, check for properties that were renamed.

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