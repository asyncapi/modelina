# JSON Schema as an input

## Processor Options

The JSON Schema input processor provides several options to customize how schemas are interpreted into models. These options can be passed to the generator via the `processorOptions` parameter.

### Available Options

#### `interpretSingleEnumAsConst`
**Type**: `boolean` (default: `false`)

When enabled, a single enum value like `{enum: ['test']}` will be interpreted the same as `{const: 'test'}`. This reduces the number of enums being generated and uses constant values instead.

**Example**:
```typescript
const generator = new TypeScriptGenerator({
  processorOptions: {
    jsonSchema: {
      interpretSingleEnumAsConst: true
    }
  }
});
```

See the [json-schema-single-enum-as-const example](../../examples/json-schema-single-enum-as-const) for a complete usage example.

#### `propertyNameForAdditionalProperties`
**Type**: `string` (default: `'additionalProperties'`)

Changes which property name should be used to represent `additionalProperties` in JSON Schema. This is useful when you want to customize the generated property name for additional properties in your models.

**Example**:
```typescript
const generator = new TypeScriptGenerator({
  processorOptions: {
    jsonSchema: {
      propertyNameForAdditionalProperties: 'metadata'
    }
  }
});
```

See the [json-schema-additional-properties-representation example](../../examples/json-schema-additional-properties-representation) for a complete usage example.

#### `allowInheritance`
**Type**: `boolean` (default: `false`)

Enables support for inheritance in the generated models. When enabled, models can extend from other models based on the schema structure (such as `allOf` patterns).

**Example**:
```typescript
const generator = new TypeScriptGenerator({
  processorOptions: {
    jsonSchema: {
      allowInheritance: true
    }
  }
});
```

See the [json-schema-allow-inheritance example](../../examples/json-schema-allow-inheritance) for a complete usage example.

#### `disableCache`
**Type**: `boolean` (default: `false`)

Disables the seenSchemas cache in the Interpreter. This option should only be used in specific internal scenarios and generally should not be modified by end users.

#### `ignoreAdditionalProperties`
**Type**: `boolean` (default: `false`)

For JSON Schema draft 7, `additionalProperties` are by default `true`, but this might create unintended properties in the models. Use this option to ignore default `additionalProperties` for models that have other properties defined with them.

**Note**: ONLY use this option if you do not have control over your schema files. Instead, adapt your schemas to be more strict by setting `additionalProperties: false`.

**Example**:
```typescript
const generator = new TypeScriptGenerator({
  processorOptions: {
    jsonSchema: {
      ignoreAdditionalProperties: true
    }
  }
});
```

See the [json-schema-ignore-additional-properties example](../../examples/json-schema-ignore-additional-properties) for a complete usage example.

#### `ignoreAdditionalItems`
**Type**: `boolean` (default: `false`)

For JSON Schema draft 7, `additionalItems` are by default `true`, but this might create unintended types for arrays. Use this option to ignore default `additionalItems` for models as long as there are other types set for the array.

**Note**: ONLY use this option if you do not have control over the schema files you use to generate models from. Instead, you should adapt your schemas to be more strict by setting `additionalItems: false`.

**Example**:
```typescript
const generator = new TypeScriptGenerator({
  processorOptions: {
    jsonSchema: {
      ignoreAdditionalItems: true
    }
  }
});
```

See the [json-schema-ignore-additional-items example](../../examples/json-schema-ignore-additional-items) for a complete usage example.

---

For a comprehensive example demonstrating multiple processor options together, see the [json-schema-processor-options example](../../examples/json-schema-processor-options).

## Interpretation of JSON Schema to CommonModel

The library transforms JSON Schema from data validation rules to data definitions (`CommonModel`(s)). 

The algorithm tries to get to a model whose data can be validated against the JSON schema document. 

As of now we only provide the underlying structure of the schema file for the model, where constraints/annotations such as `maxItems`, `uniqueItems`, `multipleOf`, etc. are not interpreted.
## Patterns
Beside the regular interpreter we also look for certain patterns that are interpreted slightly differently.

### `oneOf` with `allOf`
If both oneOf and allOf is present, each allOf model is merged into the interpreted oneOf.

For example take this example:
```json
{
  "allOf":[
    {
      "title":"Animal",
      "type":"object",
      "properties":{
        "animalType":{
          "title":"Animal Type",
          "type":"string"
        },
        "age":{
          "type":"integer",
          "min":0
        }
      }
    }
  ],
  "oneOf":[
    {
      "title":"Cat",
      "type":"object",
      "properties":{
        "animalType":{
          "const":"Cat"
        },
        "huntingSkill":{
          "title":"Hunting Skill",
          "type":"string",
          "enum":[
            "clueless",
            "lazy"
          ]
        }
      }
    },
    {
      "title":"Dog",
      "type":"object",
      "additionalProperties":false,
      "properties":{
        "animalType":{
          "const":"Dog"
        },
        "breed":{
          "title":"Dog Breed",
          "type":"string",
          "enum":[
            "bulldog",
            "bichons frise"
          ]
        }
      }
    }
  ]
}
```
Here animal is merged into cat and dog.

### `oneOf` with `properties`
If both oneOf and properties are both present, it's interpreted exactly like [oneOf with allOf](#oneof-with-allof). That means that the following:

```json
{
  "title":"Animal",
  "type":"object",
  "properties":{
    "animalType":{
      "title":"Animal Type",
      "type":"string"
    },
    "age":{
      "type":"integer",
      "min":0
    }
  },
  "oneOf":[
    {
      "title":"Cat",
      "type":"object",
      "properties":{
        "animalType":{
          "const":"Cat"
        },
        "huntingSkill":{
          "title":"Hunting Skill",
          "type":"string",
          "enum":[
            "clueless",
            "lazy"
          ]
        }
      }
    },
    {
      "title":"Dog",
      "type":"object",
      "additionalProperties":false,
      "properties":{
        "animalType":{
          "const":"Dog"
        },
        "breed":{
          "title":"Dog Breed",
          "type":"string",
          "enum":[
            "bulldog",
            "bichons frise"
          ]
        }
      }
    }
  ]
}
```
where all the defined behavior on the root object are merged into the two oneOf models cat and dog.

## Interpreter 
The main functionality is located in the `Interpreter` class. This class ensures to recursively create (or retrieve from a cache) a `CommonModel` representation of a Schema. We have tried to keep the functionality split out into separate functions to reduce complexity and ensure it is easy to maintain. 

The order of interpretation:
- `true` boolean schema infers all model types (`object`, `string`, `number`, `array`, `boolean`, `null`, `integer`) schemas.
- `type` infers the initial model type.
- `required` are interpreted as is.
- `patternProperties` are merged together with any additionalProperties, where duplicate pattern models are [merged](#merging-models).
- `additionalProperties` are interpreted as is, where duplicate additionalProperties for the model are [merged](#merging-models). If the schema does not define `additionalProperties` it defaults to `true` schema.
- `additionalItems` are interpreted as is, where duplicate additionalItems for the model are [merged](#merging-models). If the schema does not define `additionalItems` it defaults to `true` schema.
- `items` are interpreted as ether tuples or simple array, where more than 1 item are [merged](#merging-models). Usage of `items` infers `array` model type.
- `properties` are interpreted as is, where duplicate `properties` for the model are [merged](#merging-models). Usage of `properties` infers `object` model type.
- [allOf](#allOf-sub-schemas)
- `dependencies` only apply to schema dependencies, since property dependencies adds nothing to the underlying model. Any schema dependencies are interpreted and then [merged](#merging-models) together with the current interpreted model.
- `enum` is interpreted as is, where each `enum`. Usage of `enum` infers the enumerator value type to the model, but only if the schema does not have `type` specified.
- `const` interpretation overwrite already interpreted `enum`. Usage of `const` infers the constant value type to the model, but only if the schema does not have `type` specified.
- [allOf/oneOf/anyOf/then/else](#processing-sub-schemas)
- [not](#interpreting-not-schemas)

## Interpreting not schemas
`not` schemas infer the form for which the model should not take by recursively interpret the `not` schema. It removes certain model properties when encountered.

Currently, the following `not` model properties are interpreted:
- `type`
- `enum`

**Restrictions** 
- You cannot use nested `not` schemas to infer new model properties, it can only be used to re-allow them.
- boolean `not` schemas are not applied.

## Processing sub schemas
The following JSON Schema keywords are [merged](#merging-models) with the already interpreted model:
- `allOf`
- `oneOf`
- `anyOf`
- `then`
- `else`

## Merging models
Because of the recursive nature of the interpreter (and the nested nature of JSON Schema) it happens that two models needs to be merged together. 

If only one side has a property defined, it is used as is, if both have it defined they are merged based on the following logic (look [here](./input_processing.md#internal-model-representation) for more information about the CommonModel and its properties):
- `additionalProperties` if both models contain it the two are recursively merged together. 
- `patternProperties` if both models contain it each pattern model are recursively merged together. 
- `properties` if both models contain the same property the corresponding models are recursively merged together. 
- `items` are merged together based on a couple of rules:
    - If both models are simple arrays those item models are merged together as is.
    - If both models are tuple arrays each tuple model (at specific index) is merged together.
    - If either one side is different from the other, the tuple schemas is prioritized as it is more restrictive.
- `types` if both models contain types they are merged together, duplicate types are removed.
- `enum` if both models contain enums they are merged together, duplicate enums are removed.
- `required` if both models contain required properties they are merged together, duplicate required properties are removed.
- `$id`, `$ref`, `extend` uses left model value if present otherwise right model value if present.
- `originalSchema` are overwritten.
