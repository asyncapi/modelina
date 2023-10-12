# Migration from v1 to v2

This document contains all the breaking changes and migrations guidelines for adapting your code to the new version.

## Using preferred ids over anonymous ids

If you use _allOf_, and properties need to be merged, Modelina is now using preferred ids over anonymous ids. That means if a property has an id/title other than _anonymous_schema_ in one of the schemas in a _allOf_, it will use the non-anonymous id/title.

Example:

```yaml
channels:
  pet:
    publish:
      message:
        oneOf:
          - $ref: '#/components/messages/Dog'
          - $ref: '#/components/messages/Cat'
components:
  messages:
    Dog:
      payload:
        title: Dog
        allOf:
          - $ref: '#/components/schemas/CloudEvent'
          - type: object
            properties:
              type:
                title: DogType
                const: Dog
    Cat:
      payload:
        title: Cat
        allOf:
          - $ref: '#/components/schemas/CloudEvent'
          - type: object
            properties:
              type:
                title: CatType
                const: Cat
  schemas:
    CloudEvent:
      type: object
      properties:
        type:
          type: string
      required:
        - type
```

The _type_ property in the _CloudEvent_ schema will in this case have an _anonymous_schema_ id. If another schema in the _allOf_ list has the same property and an id other than _anonymous_schema_, it will now use that id. Meaning, in this example, it will be _DogType_ and _CatType_.

## Accurate array types

For JSON Schema inputs (indirectly for AsyncAPI and OpenAPI), `additionalItems` was applied to regular array types, when it should only be applied for tuples.

This means that a schema such as:

```
    "tags": {
      "type": "array",
      "items": {
        "$ref": "http://asyncapi.com/definitions/2.6.0/tag.json"
      },
      "additionalItems": true
    },
```

Would generate a type such as, in TypeScript:

```
private _tags?: (Tag | any)[];
```

Where it now generates:

```
private _tags?: Tag[];
```

## Creates union type for operation message oneOf

In the example above, where `operation.message.oneOf` is set, Modelina will now generate a union type for it. Previously, Modelina ignored this union type, and only generated models for the content of `operation.message.oneOf`. In the example above, that meant models for `Dog` and `Cat`. Now, Modelina will generate a union type of `Pet` in addition to `Dog` and `Cat`.

## Constraining models with then and else

In v1, `required` properties defined within `then` or `else` (in JSON Schema input variants) would be directly applied to the encapsulating model, meaning it would be as if the `if` section is always true or false, depending on whether it's defined within `then` or `else` respectfully.

In v2, `required` properties are no longer applied, but the rest of the structure is still.

## Constant values

(Constant values)[https://json-schema.org/understanding-json-schema/reference/generic.html#constant-values] are now supported.

```yaml
type: object
properties:
  country:
    const: 'United States of America'
```

The `country` property will not have a setter and will automatically be initialized.

## Discriminator

(Discriminator)[https://www.asyncapi.com/docs/reference/specification/v2.6.0#schemaComposition] is now supported.

```yaml
schemas:
  Pet:
    type: object
    discriminator: petType
    properties:
      petType:
        type: string
      name:
        type: string
    required:
      - petType
      - name
  Cat:
    allOf:
      - $ref: '#/components/schemas/Pet'
      - type: object
        properties:
          petType:
            const: Cat
  Dog:
    allOf:
      - $ref: '#/components/schemas/Pet'
      - type: object
        properties:
          petType:
            const: Dog
```

This example will generate a model for `Cat` and `Dog` where `PetType` is a shared enum that contains two values (`Cat` and `Dog`). `PetType` will not have a setter, and will automatically be initialized.

## Optional properties in Kotlin

In Kotlin, if property is not `required` in JSON Schema, it will be nullable in Kotlin with default value `null`.

```yaml
Response:
  type: object
  properties:
    result:
      type: string
    message:
      type: string
  required:
    - result
  additionalProperties: false
```

will generate

```kotlin
data class Response(
    val result: String,
    val message: String? = null
)
```

## Optional properties in Java
In Java, if property is not `required` in JSON Schema, it should use nullable types instead of primitive.

```yaml
Response:
  type: object
  properties:
    result:
      type: number
    message:
      type: number
  required:
  - result
  additionalProperties: false

```

Will now generate:

```java
public class Response {
  private double result;
  private Double message;

  public double getResult() { return this.result; }
  public void setResult(double result) { this.result = result; }

  public Double getMessage() { return this.message; }
  public void setMessage(Double message) { this.message = message; }
}
```

## Interface for objects in oneOf for Java

In Java, if a oneOf includes objects, there will be created an interface. All the classes that are part of the oneOf, implements the interface. The Jackson preset includes support for unions by setting @JsonTypeInfo and @JsonSubTypes annotations.

```yaml
components:
  messages:
    Vehicle:
      payload:
        title: Vehicle
        type: object
        discriminator: vehicleType
        properties:
          vehicleType:
            title: VehicleType
            type: string
        required:
          - vehicleType
        oneOf:
          - $ref: '#/components/schemas/Car'
          - $ref: '#/components/schemas/Truck'
  schemas:
    Car:
      type: object
      properties:
        vehicleType:
          const: Car
    Truck:
      type: object
      properties:
        vehicleType:
          const: Truck
```

will generate

```java
@JsonTypeInfo(use=JsonTypeInfo.Id.NAME, include=JsonTypeInfo.As.EXISTING_PROPERTY, property="vehicleType")
@JsonSubTypes({
  @JsonSubTypes.Type(value = Car.class, name = "Car"),
  @JsonSubTypes.Type(value = Truck.class, name = "Truck")
})
/**
 * Vehicle represents a union of types: Car, Truck
 */
public interface Vehicle {
  VehicleType getVehicleType();
}

public class Car implements Vehicle {
  @NotNull
  @JsonProperty(\\"vehicleType\\")
  private final VehicleType vehicleType = VehicleType.CAR;
  private Map<String, Object> additionalProperties;

  public VehicleType getVehicleType() { return this.vehicleType; }

  public Map<String, Object> getAdditionalProperties() { return this.additionalProperties; }
  public void setAdditionalProperties(Map<String, Object> additionalProperties) { this.additionalProperties = additionalProperties; }
}

public enum VehicleType {
  CAR((String)"Car"), TRUCK((String)"Truck");

  private String value;

  VehicleType(String value) {
    this.value = value;
  }

  @JsonValue
  public String getValue() {
    return value;
  }

  @JsonCreator
  public static VehicleType fromValue(String value) {
    for (VehicleType e : VehicleType.values()) {
      if (e.value.equals(value)) {
        return e;
      }
    }
    throw new IllegalArgumentException("Unexpected value '" + value + "'");
  }

  @Override
  public String toString() {
    return String.valueOf(value);
  }
}

public class Truck implements Vehicle {
  @NotNull
  @JsonProperty("vehicleType")
  private final VehicleType vehicleType = VehicleType.TRUCK;
  private Map<String, Object> additionalProperties;

  public VehicleType getVehicleType() { return this.vehicleType; }

  public Map<String, Object> getAdditionalProperties() { return this.additionalProperties; }
  public void setAdditionalProperties(Map<String, Object> additionalProperties) { this.additionalProperties = additionalProperties; }
}
```
# OpenAPI inputs now generate parameters as models
For a given OpenAPI input, it now generate [parameter models on-top of the payload models](https://github.com/asyncapi/modelina/pull/1498) as the default behavior.

# `renderCompleteModel` and `render` now use object arguments
As parameters grow, regular arguments become cumbersome, so we are starting to [switch over to using object arguments](https://github.com/asyncapi/modelina/pull/1505).

This means that the following functions are going to change from:

```ts
generator.renderCompleteModel(
  constrainedModel,
  inputModel,
  completeOptions,
  options
);

generator.render(
  constrainedModel,
  inputModel,
  options
);
```

To
```ts
generator.renderCompleteModel({
  constrainedModel,
  inputModel,
  completeOptions,
  options
});

generator.render({
  constrainedModel,
  inputModel,
  options
});
```

# Nullable models

Each [meta model](../internal-model.md) up until now where not able to be marked as nullable, but now they can be through `isNullable`. Here are the different outputs and how they now apply nullable types.

## TypeScript

Across all models, if they are nullable they will get the union `x | null`.

## JavaScript
Is not affected by this change.

## C#
Is not affected by this change.

## Java
With this update, Float, Integer and Boolean meta models are rendered between their primitive types (for example `float`) and wrapper classes (for example `Float`) for nullable.

[`Double` now also respect being nullable](https://github.com/asyncapi/modelina/pull/1439).

## Kotlin
Is not affected by this change.

## Rust 
Is not affected by this change.

## Python
Is not affected by this change.

## Go
Is not affected by this change.

## Dart
Is not affected by this change.

## C++
Is not affected by this change.

# Upgrading to Node v18
[As Node v14 is unmaintained we have upgraded to use Node v18.](https://github.com/asyncapi/modelina/pull/1422)


