import { CSHARP_JSON_SERIALIZER_PRESET, CSHARP_NEWTONSOFT_SERIALIZER_PRESET, CSharpFileGenerator } from '../../';
import path from 'path';
import input from './generic-input-csharp.json';

async function generateJsonSerializer() {
  const generator = new CSharpFileGenerator({
    presets: [CSHARP_JSON_SERIALIZER_PRESET]
  });
  
  await generator.generateToFiles(
    input,
    path.resolve(
      // eslint-disable-next-line no-undef
      __dirname,
      './runtime-csharp/runtime-csharp/src/models/json_serializer'
    ),
    { namespace: 'com.mycompany.app.json_serializer' }
  );  
}
async function generateNewtonsoft() {
  const generator = new CSharpFileGenerator({
    presets: [CSHARP_NEWTONSOFT_SERIALIZER_PRESET]
  });
  await generator.generateToFiles(
    input,
    path.resolve(
      // eslint-disable-next-line no-undef
      __dirname,
      './runtime-csharp/runtime-csharp/src/models/newtonsoft'
    ),
    { namespace: 'com.mycompany.app.newtonsoft' }
  ); 
}

async function generateEverything() {
  await Promise.all(
    [
      generateJsonSerializer(),
      generateNewtonsoft()
    ]
  )
}
generateEverything();