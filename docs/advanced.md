# Advanced use-cases for Modelina

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Generate each model in the same file](#generate-each-model-in-the-same-file)
- [Generate a model in separate files](#generate-a-model-in-separate-files)
- [Include a custom function in the data model](#include-a-custom-function-in-the-data-model)
- [## Use the models for data transfer](#%23%23-use-the-models-for-data-transfer)
- [Extend the logic of an existing renderer](#extend-the-logic-of-an-existing-renderer)
- [Build your own model renderer](#build-your-own-model-renderer)
- [Create your own models from the ground up, instead of a supported input](#create-your-own-models-from-the-ground-up-instead-of-a-supported-input)
- [Adding logging to the library](#adding-logging-to-the-library)
  * [Example usage](#example-usage)
- [Change the generated indentation type and size](#change-the-generated-indentation-type-and-size)
- [Change the naming format for properties](#change-the-naming-format-for-properties)
- [Change the naming format for data models](#change-the-naming-format-for-data-models)

<!-- tocstop -->

## Generate each model in the same file
TODO 

## Generate a model in separate files
TODO 

## Include a custom function in the data model
TODO 

## ## Use the models for data transfer
TODO 

## Extend the logic of an existing renderer
TODO 

## Build your own model renderer
TODO 

## Create your own models from the ground up, instead of a supported input
TODO 


## Adding logging to the library
When you are generating models this library uses a detached logging module so you can integrate your own logging implementation based on your needs. By default nothing is logged to console or otherwise.

The library uses 4 different logging levels:
- `debug`, for any very specific details only relevant to debugging.
- `info`, for any general information relevant to the user.
- `warn`, for any warnings that the user might need if the output is not as expected.
- `error`, for any errors that occur in the library.

### Example usage
This is an example integration of how to add a custom logger to the library:

```ts
import {ModelLoggingInterface, Logger} from '@asyncapi/modelina'; 
const customLogger: ModelLoggingInterface = {
    debug: (msg: string) => { console.log(msg) },
    info: (msg: string) => { console.log(msg) },
    warn: (msg: string) => { console.log(msg) },
    error: (msg: string) => { console.log(msg) }
};
Logger.setLogger(customLogger);

// Now use the library as normal without doing anything else. 
// const generator = new TypeScriptGenerator({ modelType: 'interface' });
// const interfaceModel = await generator.generate(...);
```

## Change the generated indentation type and size
TODO 

## Change the naming format for properties
TODO 

## Change the naming format for data models
TODO
