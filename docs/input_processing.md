# Input process

The [InputProcessor](../src/processors/InputProcessor.ts) is our main point of entry for processing input data. It uses the defined input processors (`AsyncAPIInputProcessor`, `JsonSchemaInputProcessor`, ...) by first calling `shouldProcess` function for each input processor to figure out if the input data should be processed by the respective processor. If it should the `process` function is then called. It uses a first-come, first-serve principle, where the first processor that accepts the input process's it. If no processor accepts the input it defaults to `JsonSchemaInputProcessor`. 

The `process` function are expected to return `CommonInputModel` which is a wrapper for the core data representation of `CommonModel`. This is done to ensure we can return multiple models for any input to allow for references, inheritance etc. 

As said the core internal representation of a data model is `CommonModel`. It contains the data definition by using known keywords from JSON Schema, but instead of it representing a validation rules it represents the data definition for the model. The explanation for the `CommonModel` properties can be found [here](../API.md#CommonModel).

## AsyncAPI
At the moment the library only supports the whole AsyncAPI file as input where it generates models for all defined message payloads. If any other kind of AsyncAPI input is wanted please create a [feature request](https://github.com/asyncapi/modelina/issues/new?assignees=&labels=enhancement&template=enhancement.md).

The AsyncAPI input processor expects that the property `asyncapi` is defined in order to know it should be processed using this.

The payload, since it is of type JSON Schema, is then passed to the [JSON Schema processor](#JSON-Schema) which handle the rest of the processing.

## JSON Schema
For us to convert JSON Schema into `CommonInputModel` we use a process we call the interpreter process. This means that we interpret the JSON Schema validation rules (`Schema` or Boolean) into data definitions (`CommonModel`). This process is quite complex and needs it own section for explaining how it works.

Read [this](./interpretation_of_JSON_Schema_draft_7.md) document for more information.
