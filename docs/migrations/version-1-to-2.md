# Migration from v1 to v2

This document contain all the breaking changes and migrations guidelines for adapting your code to the new version.

## Using preferred ids over anonymous ids

If you use _allOf_, and properties needs to be merged, Modelina is now using preferred ids over anonymous ids. That means if a property has a id/title other than _anonymous_schema_ in one of the schemas in a _allOf_, it will use the non anonymous id/title.

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

## Fixes required properties when if/then/else is used

Required properties in schemas inside if/then/else is made optional when merged with the original schema.
