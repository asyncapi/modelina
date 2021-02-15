# generator-model-sdk



## Simplification process

In order to simplify the model rendering process as much as possible we want to simplify any input schemas into CommonModel's where combination, conditional and what ever we have are applied so we have a bare minimum schema.

We have split out the different simplification processes into separate small functions which recursively simplifies schemas, these are the different simplifications:

- [Simplification of types](./docs/SimplifyTypes.md)
- [Simplification of enums](./docs/SimplifyEnums.md)
- [Simplification of items](./docs/SimplifyItems.md)
- [Simplification of properties](./docs/SimplifyProperties.md)
- [Simplification of additional properties](./docs/SimplifyAdditionalProperties.md)
