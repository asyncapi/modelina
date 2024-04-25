# Migration from v3 to v4

This document contain all the breaking changes and migrations guidelines for adapting your code to the new version.

## Deprecation of `processor.interpreter`

Since the early days we had the option to set `processorOptions.interpreter` options to change how JSON Schema is interpreted to Meta models. However, these options are more accurately part of the `processorOptions.jsonSchema` options.

Use this instead going forward.

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

Models are aiming to be >= v3.7 compliant.

### Pydantic now follows v2 instead of v1

Reference: https://docs.pydantic.dev/2.6/migration/

The schema description is now a description and not an alias:

```python
class Message(BaseModel):
  identifier: str = Field(description='''The Identifier for the Message''')
```

In Modelina v3 this used is rendered as:

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

### Type hints

Classes now have type hints on all properties and accessor functions.

Before:

```python
from typing import Any, Dict
class ObjProperty:
  def __init__(self, input):
    if hasattr(input, 'number'):
      self._number = input['number']
    if hasattr(input, 'additional_properties'):
      self._additional_properties = input['additional_properties']

  @property
  def number(self):
    return self._number
  @number.setter
  def number(self, number):
    self._number = number

  @property
  def additional_properties(self):
    return self._additional_properties
  @additional_properties.setter
  def additional_properties(self, additional_properties):
    self._additional_properties = additional_properties
```

After:

```python
from typing import Any, Dict
class ObjProperty:
  def __init__(self, input: Dict):
    if hasattr(input, 'number'):
      self._number: float = input['number']
    if hasattr(input, 'additional_properties'):
      self._additional_properties: dict[str, Any] = input['additional_properties']

  @property
  def number(self) -> float:
    return self._number
  @number.setter
  def number(self, number: float):
    self._number = number

  @property
  def additional_properties(self) -> dict[str, Any]:
    return self._additional_properties
  @additional_properties.setter
  def additional_properties(self, additional_properties: dict[str, Any]):
    self._additional_properties = additional_properties
```

### Initialization of correct models

Before in the constructor, if a property was another class, they would not correctly be initialized. Now a new instance of the object is created.

### Constants are now rendered

Before, constants where completely ignored, now they are respected and also means you don't have the possibility to change it through setters for example.

```python
class Address:
  def __init__(self, input: Dict):
    self._street_name: str = 'someAddress'

  @property
  def street_name(self) -> str:
    return self._street_name
```

### Import style deprecation

All models are from this point onwards imported using explicit styles `from . import ${model.name}` to allow for circular model dependencies to work. This means that the option `importsStyle` is deprecated and is no longer in use. It will be removed at some point in the future. 

## Go

### File names

In v4, file names for go will be formatted as `snake_case.go`. This is the "standard" in go: https://github.com/golang/go/issues/36060

### Union types will be generated correctly with struct embeddings

Modelina now supports union types for `Go`. Since `Go` does not have native union types support modelina uses `struct embeddings` to mock union types.

```go
type Union struct {
  CustomStruct
  int
  string
  ModelinaArrType []string
  ModelinaDictType map[string] interface{}
  ModelinaAnyType interface {}
}
```

`ModelinaArrType`, `ModelinaDictType`, `ModelinaAnyType` are generated by default by modelina, users can change the names by passing different names to the `GoGenerator Options`, for example:

```ts
const generator = new GoGenerator({
  unionAnyModelName: 'ModelinaAnyType',
  unionArrModelName: 'ModelinaArrType',
  unionDictModelName: 'ModelinaDictType'
});
```

### Union type with discriminator will render an interface and the children will implement that interface

While the above changes work for primitives, it's problematic for objects with a discriminator. This is solved by creating an interface for the parent with the discriminator and each child implements the interface:

```go
type Vehicle interface {
  IsVehicleVehicleType()
}

type Car struct {
  VehicleType *VehicleType
  RegistrationPlate string
  AdditionalProperties map[string]interface{}
}

func (r Car) IsVehicleVehicleType() {}

type Truck struct {
  VehicleType *VehicleType
  RegistrationPlate string
  AdditionalProperties map[string]interface{}
}

func (r Truck) IsVehicleVehicleType() {}

type VehicleType uint

const (
  VehicleTypeCar VehicleType = iota
  VehicleTypeTruck
)

// Value returns the value of the enum.
func (op VehicleType) Value() any {
	if op >= VehicleType(len(VehicleTypeValues)) {
		return nil
	}
	return VehicleTypeValues[op]
}

var VehicleTypeValues = []any{\\"Car\\",\\"Truck\\"}
var ValuesToVehicleType = map[any]VehicleType{
  VehicleTypeValues[VehicleTypeCar]: VehicleTypeCar,
  VehicleTypeValues[VehicleTypeTruck]: VehicleTypeTruck,
}
```

### Nullable and required properties

Modelina now has support for nullable and required properties in go structs. This support exists for generic types like `int`, `string`, `bool`, `float64`.

```go
type info struct {
  name string // required
  description *string // nullable
  version *float64
  isDevelopment *bool
}
```
