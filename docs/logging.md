# Logging
When you are generating models this library uses a detached logging module so you can integrate your own logging implementation based on your needs. By default nothing is logged to console or otherwise.

The library uses 4 different logging levels:
- `debug`, for any very specific details only relevant to debugging.
- `info`, for any general information relevant to the user.
- `warn`, for any warnings that the user might need if the output is not as expected.
- `error`, for any errors that occur in the library.

## Example
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
