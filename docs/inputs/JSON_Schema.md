# Interpretation of JSON Schema to CommonModel

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
