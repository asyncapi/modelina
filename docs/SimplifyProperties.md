# Determining the properties for the model

In order to determine all the possible properties a schema can be, we both infer and use existing definitions of types, however we need to define a precedence for JSON Schema keywords for in which order they types are inferred or determined.

## Precedence
The precedence of keywords are in which order we infer or determine properties in. The following are the precedence for determining types:

`properties` --> `allOf` --> `oneOf` --> `anyOf` --> `then` --> `else`

### Non-mentioned keywords
Any keywords not mentioned as a title are all cumulating the properties.
