import { KOTLIN_DEFAULT_PRESET, KotlinFileGenerator } from '../../';
import path from 'path';
import input from './generic-input.json';

const generator = new KotlinFileGenerator({
  presets: [KOTLIN_DEFAULT_PRESET]
});

generator.generateToFiles(
  input,
  path.resolve(
    // eslint-disable-next-line no-undef
    __dirname,
    './runtime-kotlin/src/main/kotlin/com/mycompany/app/generic'
  ),
  { packageName: 'com.mycompany.app.generic' }
);
