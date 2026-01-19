import { SCALA_DEFAULT_PRESET, ScalaFileGenerator } from '../../src';
import path from 'path';
import input from './generic-input.json';

const generator = new ScalaFileGenerator({
  presets: [SCALA_DEFAULT_PRESET]
});

generator.generateToFiles(
  input,
  path.resolve(
    // eslint-disable-next-line no-undef
    __dirname,
    './runtime-scala/src/main/scala/com/mycompany/app/generic'
  ),
  { packageName: 'com.mycompany.app.generic' }
);
