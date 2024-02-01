import { JAVA_JACKSON_PRESET, JavaFileGenerator } from '../../';
import path from 'path';
import input from './generic-input.json';

async function generateJacksonModels() {
  const generator = new JavaFileGenerator({
    presets: [JAVA_JACKSON_PRESET]
  });
  
  await generator.generateToFiles(
    input,
    path.resolve(
      // eslint-disable-next-line no-undef
      __dirname,
      './runtime-java/src/main/java/com/mycompany/app/jackson'
    ),
    { packageName: 'com.mycompany.app.jackson' }
  );
}

async function generateEverything() {
  await Promise.all(
    [
      generateJacksonModels()
    ]
  )
}
generateEverything();