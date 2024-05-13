// eslint-disable-file unicorn/prefer-module
const path = require('node:path');
process.env.TS_NODE_PROJECT = path.resolve('test/tsconfig.json');
process.env.NODE_ENV = 'development';

global.oclif = global.oclif || {};
global.oclif.columns = 80;

require('node:events').EventEmitter.defaultMaxListeners = 30;