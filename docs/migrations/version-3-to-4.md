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

## C#

### Constant values are now properly rendered as const properties

This example used to generate a `string` with a getter and setter, but will now generate a const string that is initialized to the const value provided. 

```yaml
type: object
properties:
  property:
    type: string
    const: 'abc'
```

will generate

```csharp
public class TestClass {
  private const string property = "test";  
  
  public string Property 
  {
    get { return property; }
  }
  ...
}
```

Notice that `Property` no longer has a `set` method. This might break existing models.