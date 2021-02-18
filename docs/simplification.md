# The simplification process

In order to simplify the model rendering process as much as possible, AsyncAPI Model SDK simplify transformed JSON schema into CommonModels, which contain information what type of model is, what properties single model has, etc, so finally we have a bare minimum schema.

The AsyncAPI Model SDK supports simplification of:

- [Types](#determining-the-type-for-the-model)
- [Enums](#determining-the-enums-for–the-model)
- [Items](#determining-the-items-for-the-model)
- [Properties](#determining-the-properties-for-the-model)
- [Additional properties](#determining-the-additionalProperties-for-the-model)
- [Required](#determining-the-required-properties-for-the-model)
- [Extend](#determining-the-extend-for-the-model)

## Determining the type for the model

In order to determine all the possible types a schema can be, we both infer and use existing definitions of types, however we need to define a precedence for JSON Schema keywords for in which order they types are inferred or determined.

### Precedence

The precedence of keywords are in which order we infer or determine types in. Notice it goes form left to right meaning first we set the type using the `type` keyword and then it moves right applying them one by one. The following are the precedence for determining types:

`type` --> `allOf` --> `oneOf` --> `anyOf` --> `then` --> `else` --> `enum` --> `const` --> `not`

#### Absence of data type

If a schema is defined as `true` or `false` we infer all possible JSON types.

#### Enum and const

`enum` and `const` are ONLY used to infer the type if it has not already been defined. Type is inferred from the provided value(s).

#### Not

`not` if defined always overwrites any existing inference of types.

#### Non-mentioned keywords

Any keywords not mentioned as a title are all cumulating the type.

## Determining the enums for the model

In order to determine all the possible enums a schema can be we both infer and use existing definitions of types, however we need to define a precedence for JSON Schema keywords and in which order they are applied.

### Precedence

The precedence of keywords are in which order we infer or determine the `enum` value in, the following are the precedence for determining enums:

`enum` --> `allOf` --> `oneOf` --> `anyOf` --> `then` --> `else` --> `const` --> `not`

#### Const

`const` if defined it always overwrites any already determined enums.

#### Not

`not` if defined it removes any matching enums.

#### Non-mentioned keywords

Any keywords not mentioned as a title are all cumulating the enum values.

## Determining the items for the model

In order to determine all the possible items a schema can be, we both infer and use existing definitions, however we need to define a precedence for JSON Schema keywords for in which order the items are inferred or determined.

### Precedence

The precedence of keywords are in which order we infer or determine items in. The following are the precedence for determining types:

`items` --> `allOf` --> `oneOf` --> `anyOf` --> `then` --> `else`

#### Items

All items are recursively simplified using the main simplification wrapper `simplifyRecursive` which ensures if it come across a schema of type object it splits them out into a reference and new instance of the common model.

#### Non-mentioned keywords

Any keywords not mentioned as a title are all cumulating the items.

## Determining the properties for the model

In order to determine all the possible properties a schema can be, we both infer and use existing definitions, however we need to define a precedence for JSON Schema keywords for in which order the properties are inferred or determined.

### Precedence

The precedence of keywords are in which order we infer or determine properties in. The following are the precedence for determining types:

`properties` --> `allOf` --> `oneOf` --> `anyOf` --> `then` --> `else`

#### Properties

All properties are recursively simplified using the main simplification wrapper `simplifyRecursive` which ensures if it come across a schema of type object it splits them out into a reference and new instance of the common model.

#### Non-mentioned keywords

Any keywords not mentioned as a title are all cumulating the properties.

## Determining the additionalProperties for the model

Additional properties are determined by the following form:

1. Incase it is `undefined` or `false` the `additionalProperties` is set to `undefined`. This is because undefined are easier to handle in the rendering phase then if `additionalProperties` could be `undefined` or `false`. 
2. Otherwise recursively simplify the `additionalProperties` schema/boolean.

## Determining the required properties for the model

In order to determine all the possible required properties a schema can have, we both merge and use existing definitions, however we need to define a precedence for JSON Schema keywords for in which order the required are merged or determined.

### Precedence

The precedence of keywords are in which order we merge or determine `required` in. The following are the precedence for determining the array of required:

`required` --> `allOf` --> `oneOf` --> `anyOf` --> `then` --> `else`

## Determining the extend for the model

The `extend` keyword is one of the few keywords not originally from the JSON Schema specification. This keyword is used for when an object needs to extend another, where the name of the other `CommonModel` is used. Because of the nature of JSON Schema (`allOf` being an array) this extend keyword is an array of strings.

The simplification process determines the `extend` keyword based on the `allOf` keyword, where it iterates over all schemas and recursively simplifies each. If iterated simplified schema is of type object we add it to the `extend` list.
