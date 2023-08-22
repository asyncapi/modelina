import { CSHARP_JSON_SERIALIZER_PRESET, CSharpFileGenerator } from '../../';
import path from 'path';
import input from './generic-input.json';

const generator = new CSharpFileGenerator({
  presets: [CSHARP_JSON_SERIALIZER_PRESET]
});

generator.generateToFiles(
  input,
  path.resolve(
    // eslint-disable-next-line no-undef
    __dirname,
    './runtime-csharp/runtime-csharp/src/models/json_serializer'
  ),
  { namespace: 'com.mycompany.app.generic' }
);
