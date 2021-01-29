# Determining the enums for the model

In order to determine all the possible enums a schema can be we both infer and use existing definitions of types, however we need to define a precedence for JSON Schema keywords and in which order they are applied.

## Precedence
The precedence of keywords are in which order we infer or determine the `enum` value in, the following are the precedence for determining enums:

`enum` --> `allOf` --> `oneOf` --> `anyOf` --> `then` --> `else` --> `const` --> `not`

### Const
`const` if defined it always overwrites any already determined enums.

### Not
`not` if defined it removes any matching enums.

### Non-mentioned keywords
Any keywords not mentioned as a title are all cumulating the enum values.
