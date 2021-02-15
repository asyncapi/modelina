# Determining the required properties for the model

In order to determine all the possible required properties a schema can have, we both merge and use existing definitions, however we need to define a precedence for JSON Schema keywords for in which order the required are merged or determined.

## Precedence

The precedence of keywords are in which order we merge or determine `required` in. The following are the precedence for determining the array of required:

`required` --> `allOf` --> `oneOf` --> `anyOf` --> `then` --> `else`
