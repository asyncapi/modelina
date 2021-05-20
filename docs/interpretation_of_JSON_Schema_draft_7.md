# Interpretation of JSON Schema draft 7 to CommonModel

The library transforms JSON Schema from data validation rules to data definitions (`CommonModel`(s)). 

The algorithm tries to get to a model whose data can be validated against the JSON schema document. 

We only provide the underlying structure of the schema file for the model formats such as `maxItems`, `uniqueItems`, `multipleOf`, etc, are not transformed.

## Interpreter 
The main functionality is located in the `Interpreter` class. This class ensures to recursively create (or retrieve from a cache) a `CommonModel` representation of a Schema. We have tried to keep the functionality split out into separate functions to reduce complexity and ensure it is easier to maintain. This main function also ensures to split any created models into separate ones if needed.

The order of transformation:
- [type](#determining-the-type-for-the-model)
- `required` are determined as is.
- `properties` are determined as is, where duplicate properties for the model are merged.
- [allOf](#allOf-sub-schemas)
- `const` overwrite already interpreted `enums`.
- `items` are determined as is, where more then 1 item are merged.
- [oneOf/anyOf/then/else](#Processing-sub-schemas)

## allOf sub schemas
`allOf` are a bit different then the other [combination keywords](#Processing-sub-schemas) since it can imply inheritance. 

So dependant on whether the simplify option `allowInheritance` is true or false we interpret it as inheritance or simply merge the models together.

## Determining the type for the model
To determine the types for the model we use the following interpretation (and in that order):
- `true` schema infers all model types (`object`, `string`, `number`, `array`, `boolean`, `null`, `integer`).
- Usage of `type` infers the initial model type.
- Usage of `properties` infers `object` model type.
- Usage of `const` infers the constant value as type, if schema does not have `type` specified.

## Processing sub schemas
The following JSON Schema keywords are merged with the already interpreted model:
- oneOf
- anyOf
- then
- else
