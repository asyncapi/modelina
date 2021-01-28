# Determining the type for the model

In order to determine all the possible types a schema can be, we both infer and use existing definitions of types, however we need to define a precedence for JSON Schema keywords for in which order they types are inferred or determined.

## Precedence
The precedence of keywords are in which order we infer or determine types in. Notice it goes form left to right meaning first we set the type using the `type` keyword and then it moves right applying them one by one. The following are the precedence for determining types:

`type` --> `allOf` --> `oneOf` --> `anyOf` --> `then` --> `else` --> `enum` --> `const` --> `not`

### Absence of data type
If a schema is defined as `true` or `false` we infer all possible JSON types.

### Enum and const
`enum` and `const` are ONLY used to infer the type if it has not already been defined. Type is inferred from the provided value(s).

### Not
`not` if defined always overwrites any existing inference of types.

### Non-mentioned keywords
Any keywords not mentioned as a title are all cumulating the type.
