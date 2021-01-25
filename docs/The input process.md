# The Input Process
Some of the requirements for the model generation library was that it should be able to handle multiple types of inputs such as AsyncAPI, JSON Schema etc. To support this requirement the input process needs to convert any input into a common format for which the modelling process can use to reduce as much complexity as possible. We decided to settle on using JSON Schema as our common model behind the scenes with a few extra keywords.

Beside using JSON Schema we only use a very limited number of keywords and is at the moment only keywords relevant for the rendering the model.

<img src="./images/Data model - Input.png"
     alt="Markdown Monster icon"
     style="float: left; margin-right: 10px;" />


The `CommonInputModel` is the  should have the following properties:
- `models`
    - Map of simplified common models using <`$id`, `CommonModel`> type.
- `customizations`
    - The structure of how to customize the output
    - to be defined in https://github.com/asyncapi/shape-up-process/issues/53
- `originalInput`
    - The original input provided as is

 
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
    - If the model should extend some other model
    - The string should be a reference to a model with `$id`
