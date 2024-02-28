/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */

declare namespace NodeJS {
  interface Global {
    oclif: any;
  }
}

global.oclif = global.oclif || {};
global.oclif.columns = 80;

// in tests like model generation or template generation, there is need to have more listeners than default is available (10)
// this is a problem with the dependencies that are used in the given tools (I mean generator/modelina) than with the code in the CLI
require('events').EventEmitter.defaultMaxListeners = 30;
