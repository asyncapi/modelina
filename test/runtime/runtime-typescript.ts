import { TS_COMMON_PRESET, TypeScriptFileGenerator } from '../../';
import path from 'path';
import input from './generic-input.json';

const generator = new TypeScriptFileGenerator({
  presets: [{
    preset: TS_COMMON_PRESET,
    options: {
      marshalling: true
    }
  }]
});

generator.generateToFiles(
  input,
  path.resolve(
    // eslint-disable-next-line no-undef
    __dirname,
    './runtime-typescript/src'
  ),
  { exportType: 'named' }
);
