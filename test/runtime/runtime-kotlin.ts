import {
  KOTLIN_DEFAULT_PRESET,
  KOTLIN_JACKSON_PRESET,
  KotlinFileGenerator
} from '../../';
import path from 'path';
import input from './generic-input.json';

const defaultGenerator = new KotlinFileGenerator({
  presets: [KOTLIN_DEFAULT_PRESET]
});

const jacksonGenerator = new KotlinFileGenerator({
  presets: [KOTLIN_JACKSON_PRESET]
});

defaultGenerator.generateToFiles(
  input,
  path.resolve(
    // eslint-disable-next-line no-undef
    __dirname,
    './runtime-kotlin/src/main/kotlin/com/mycompany/app/generic'
  ),
  { packageName: 'com.mycompany.app.generic' }
);

jacksonGenerator.generateToFiles(
  input,
  path.resolve(
    // eslint-disable-next-line no-undef
    __dirname,
    './runtime-kotlin/src/main/kotlin/com/mycompany/app/jackson'
  ),
  { packageName: 'com.mycompany.app.jackson' }
);
