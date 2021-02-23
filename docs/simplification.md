# Simplifying JSON Schema to CommonModel

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

## Determining the type for the model

In order to determine all the possible types for a model, we both infer and use existing definitions of types. 
Precedence for JSON Schema keywords needs to be predetermined to ensure consistency.
### Precedence of JSON Schema keyword

Notice it goes from left to right meaning first we set the type using the `type` keyword and then it moves right applying them one by one. The following are the precedence for determining types:

<p align="center">type --> allOf --> oneOf --> anyOf --> then --> else --> enum --> const --> not</p>

### Absence of data type

If a schema is defined as `true` or `false` we infer all possible JSON Schema types.

### Enum and const

`enum` and `const` are ONLY used to infer the type if it has not already been defined. Type is inferred from the provided value(s).

### Not

If defined, removes any defined/inferred types defined in `not`.

<br/>

## Determining the enums for the model

In order to determine the possible enums a model can be we both infer and use existing definitions, however we need to define a precedence for JSON Schema keywords and in which order they are applied.

### Precedence of JSON Schema keywords 

The following are precedence of keywords in which order we infer or determine the `enum` in:

<p align="center">enum --> allOf --> oneOf --> anyOf --> then --> else --> const --> not</p>

### Const

`const` if defined it always overwrites any already determined enums.

### Not

`not` if defined it removes any matching enums.

<br/>

## Determining the items for the model

In order to determine all the possible items a schema can be, we both infer and use existing definitions, however we need to define a precedence for JSON Schema keywords for in which order the items are inferred or determined.

### Precedence of JSON Schema keywords

The precedence of keywords are in which order we infer or determine items in. The following are the precedence for determining types:

<p align="center">items --> allOf --> oneOf --> anyOf --> then --> else</p>

### Items

All items are recursively simplified using the main simplification wrapper `simplifyRecursive` which ensures if it come across a schema of type object it splits them out into a reference and new instance of the common model.

<br/>

## Determining the properties for the model

In order to determine all the possible properties a schema can be, we both infer and use existing definitions, however we need to define a precedence for JSON Schema keywords for in which order the properties are inferred or determined.

### Precedence of JSON Schema keywords

The precedence of keywords are in which order we infer or determine properties in. The following are the precedence for determining types:

<p align="center">properties --> allOf (Only if we don't want inheritance) --> oneOf --> anyOf --> then --> else</p>

### Properties

All properties are recursively simplified using the main simplification wrapper `simplifyRecursive` which ensures if it come across a schema of type object it splits them out into a reference and new instance of the common model.

<br/>

## Determining the additionalProperties for the model

Additional properties are determined by the following form:

1. Incase it is `undefined` or `false` the `additionalProperties` is set to `undefined`. This is because undefined are easier to handle in the rendering phase then if `additionalProperties` could be `undefined` or `false`. 
2. Otherwise recursively simplify the `additionalProperties` schema/boolean.

<br/>

## Determining the required properties for the model

In order to determine all the possible required properties a schema can have, we both merge and use existing definitions, however we need to define a precedence for JSON Schema keywords for in which order the required are merged or determined.

### Precedence of JSON Schema keywords

The precedence of keywords are in which order we merge or determine `required` in. The following are the precedence for determining the array of required:

<p align="center">required --> allOf --> oneOf --> anyOf --> then --> else</p>

<br/>

## Determining the extend for the model
This simplifier is only used to inheritance is wanted.

The simplification process determines the `extend` keyword based on the `allOf` keyword, where it iterates over the schemas and recursively simplifies each. If simplified model is of type object we add it to the `extend` list.
