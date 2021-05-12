# Simplifying JSON Schema draft 7 to CommonModel

The library simplify the JSON Schema from data validation rules to data definitions (`CommonModel`(s)). We do this because JSON Schema files can be extremely complex and can in many cases be simplified down to a bare minimum representation. Now keep in mind that there is a difference between validating input and the underlying structure of the data. In our case we do not care directly about the validation of input but rather how we display the underlying structure correctly.

This document is expected to be a supplement to the code to better understand how the simplifier works.

## Simplifier
The main functionality is located in the `Simplifier` class. This class ensures to recursively create (or retrieve from a cache) a `CommonModel` representation of a Schema. We have tried to keep the functionality split out into separate functions to reduce complexity and ensure it is easier to maintain. This main function also ensures to split any created models into separate ones if needed.


To determine the different properties of `CommonModel` each property are split into separate functions:

- [Types](#determining-the-type-for-the-model)
- [Enums](#determining-the-enums-for–the-model)
- [Items](#determining-the-items-for-the-model)
- [Properties](#determining-the-properties-for-the-model)
- [Additional properties](#determining-the-additionalProperties-for-the-model)
- [Required](#determining-the-required-properties-for-the-model)
- [Extend](#determining-the-extend-for-the-model)

The order of interpretation, later keywords have a stronger impact:
- type
- required
- properties
- additional properties
- pattern properties
- items
- enums
- allOf
- oneOf 
- anyOf
- then
- else
- const
- not



## Determining the type for the model
To determine the types for the model we use the following interpretation (and in that order):
- `true` schema infer all model types (`object`, `string`, `number`, `array`, `boolean`, `null`, `integer`).
- Usage of `type` infer the initial model type.
- Usage of `items` infer `array` model type.
- Usage of `properties` infer `object` model type.
- Usage of `enum` infer the type from the value if schema does not have `type` defined (we do not want to infer type from values if user have specified one). 
- Usage of `const` infer the model type from the value if schema does not have `type` defined (we do not want to infer type from values if user have specified one). This overwrite any existing determined types.


## Determining the enums for the model

- Usage of `enum` infer model enums.
- Usage of `const` overwrite existing defined model enums.

## Determining the items for the model

In order to determine all the possible items a schema can be, we both infer and use existing definitions, however we need to define a precedence for JSON Schema keywords for in which order the items are inferred or determined.

## Implying model definitions which it should not be
With the `not` keyword we negates already determined information such as:
- The model type, any determined types for the model that matches those defined in `not` are removed from the model. For nested `not` schemas types removed can be added once again to negate the first action. 
- The model enum, any determined enums that matches those defined in `not` are removed from the model. For nested not schemas enums removed can be added once again to negate the first action.

### Items

All items are recursively simplified using the main simplification wrapper `simplifyRecursive` which ensures if it come across a schema of type object it splits them out into a reference and new instance of the common model.
