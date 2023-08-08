import { CplusplusFileGenerator } from '../../src';
import path from 'path';
import input from './generic-input.json';

const generator = new CplusplusFileGenerator();

generator.generateToFiles(
  input,
  path.resolve(
    // eslint-disable-next-line no-undef
    __dirname,
    './runtime-cplusplus/src/lib/generated'
  ),
  { namespace: 'TestNamespace' }
);
