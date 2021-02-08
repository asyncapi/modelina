# The Input Process

Some of the requirements for the model generation library was that it should be able to handle multiple types of inputs such as AsyncAPI, JSON Schema etc. To support this requirement the input process needs to convert any input into a common format for which the modelling process can use to reduce as much complexity as possible. We decided to settle on using the structural keyword of JSON Schema as our common model behind the scenes with a few extra keywords. 

Even though we are using JSON Schema we only use a very limited number of keywords based on whether it is relevant for the rendering a minimal model.

<img src="./images/Data model - Input.png"
     alt="Markdown Monster icon"
     style="float: left; margin-right: 10px;" />


The `CommonInputModel` should have the following properties:
- `models`
    - Map of simplified common models using <`$id`, `CommonModel`> type.
- `customizations`
    - The structure of how to customize the output
- `originalInput`
    - The original input provided as is without modification

 
The `CommonSchema` are the common keywords used from the JSON Schema shared between the `CommonModel` and `Schema`. At the moment only keywords which are used in the model process are shared, these keywords are:
- `$id`
- `type`
- `enum`
- `properties`
    - in the format <property name, CommonSchema>
- `items`
    - CommonSchema
- `additionalProperties`
    - CommonSchema
- `$ref`
    - reference to another CommonSchema

The `CommonModel` extends the `CommonSchema` with a few custom properties:
- `originalSchema`
    - The original JSON Schema object before the simplification progress
- `extend`
    - If the model should extend some other models
    - The string should be a reference to a model with `$id`

When you provide an input to the processor we first need to figure out what kind of input it is, and how it should be converted into a CommonInputModel object. At the moment two input processors are available, JSON Schema (defaults to this) and AsyncAPI documents/channel/operations/messages. 


In order to convert any JSON Schema into our CommonModel we use something we call the [Simplification process](##simplification-process). Once the simplification process is over we are left without any clutter from the input.

## Simplification process

In order to simplify the model rendering process as much as possible we want to remove any JSON Schema keywords which is not needed for rendering a data model.

We have split out the different simplification processes into separate small functions which recursively simplifies schemas, these are the explanations for the different functions:

- [Simplification of types](./docs/SimplifyTypes.md)
- [Simplification of enums](./docs/SimplifyEnums.md)
- [Simplification of items](./docs/SimplifyItems.md)
- [Simplification of properties](./docs/SimplifyProperties.md)
- [Simplification of extend](./docs/SimplifyExtend.md)

