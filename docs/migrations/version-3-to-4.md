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

### DateTime and DateTimeOffset are now properly rendered based on specification format

In the previous version, `date-time` and `date` formats were rendered as `DateTime` and `DateTimeOffset` respectively.
This has been changed to render `DateTimeOffset` for `date-time` and `DateTime` for `date` formats.

This might break existing implementation and require manual changes.

The best thing to do is to fix your specification and use what you really need. If you don't care about the time and time zone, use `date` instead of `date-time`.
Otherwise, keep the `date-time` format and update your code to use `DateTimeOffset` instead of `DateTime`.
That usually means doing this:

```csharp
var dateTime = new DateTime(2008, 6, 19, 7, 0, 0);

// Set the DateTime property of the ModelinaModel
var modelinaModel = new ModelinaModel();
modelinaModel.DateTime = dateTime;
Console.WriteLine(modelinaModel.DateTime);

// Get the DateTime property from the ModelinaModel
DateTime dateTime2 = modelinaModel.DateTime.LocalDateTime;
Console.WriteLine(dateTime2);
```

## Python

### Pydantic now follows v2 instead of v1

Reference: https://docs.pydantic.dev/2.6/migration/

The schema description is now a description and not an alias:

```python
class Message(BaseModel):
  identifier: str = Field(description='''The Identifier for the Message''')
```

In Modelina 3 this used is rendered as:

```python
class Message(BaseModel):
  identifier: str = Field(alias='''The Identifier for the Message''')
```

### Following standardized styling guide

Before names of properties and model names did not follow any specific styling standard.

In v4, we switched to using the following:
- Variables and functions: https://peps.python.org/pep-0008/#function-and-variable-names
- Model names: https://peps.python.org/pep-0008/#class-names

This means that properties and their accessor methods (getter and setters) have been renamed from:
```diff
- self._someWeirdValueExclamationQuotationHash_2 = input.someWeirdValueExclamationQuotationHash_2
+ self._some_weird_value_exclamation_quotation_hash_2 = input.some_weird_value_exclamation_quotation_hash_2
```

And model names have been renamed to:
```diff
- class AsyncApi_3Dot_0Dot_0SchemaDot:
+ class AsyncApi3Dot0Dot0SchemaDot:
```

If you are using the Python preset `PYTHON_JSON_SERIALIZER_PRESET`, the functions have also been renamed:
```diff
- serializeToJson
+ serialize_to_json

- deserializeFromJson
+ deserialize_from_json
```