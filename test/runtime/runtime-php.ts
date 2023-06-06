import { PHP_DEFAULT_PRESET, PhpFileGenerator } from '../../src';
import path from 'path';
import input from './generic-input.json';

const generator = new PhpFileGenerator({
  presets: [PHP_DEFAULT_PRESET]
});

generator.generateToFiles(
  input,
  path.resolve(
    // eslint-disable-next-line no-undef
    __dirname,
    './runtime-php/src/'
  ),
  {
    namespace: 'AsyncApi\\Models',
    declareStrictTypes: true
  }
);
