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

# Nullable models

Each [meta model](../internal-model.md) up until now where not able to be marked as nullable, but now they can be through `isNullable`. Here are the different outputs and how they now apply nullable types:

### TypeScript
Is not affected by this change.

### JavaScript
Is not affected by this change.

### C#
Is not affected by this change.

### Java
Is not affected by this change.

### Kotlin
Is not affected by this change.

### Rust 
Is not affected by this change.

### Python
Is not affected by this change.

### Go
Is not affected by this change.

### Dart
Is not affected by this change.
