import { JAVA_JACKSON_PRESET, JavaFileGenerator } from '../../';
import path from 'path';
import input from './generic-input.json';

const generator = new JavaFileGenerator({
  presets: [JAVA_JACKSON_PRESET]
});

generator.generateToFiles(
  input,
  // eslint-disable-next-line no-undef
  path.resolve(__dirname, './runtime-java/src/main/java/com/mycompany/app/generic'),
  { packageName: 'com.mycompany.app.generic' }
);
