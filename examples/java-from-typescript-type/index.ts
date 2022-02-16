import { JavaGenerator } from '../../src';
import * as path from 'path';
import * as fs from 'fs';

const generator = new JavaGenerator();
const generatorWithOptions = new JavaGenerator(
  {
    processorOptions: {
      typescript: {
        compilerOptions: {
          strictNullChecks: false
        }
      }
    }
  }
);

const file = path.resolve(__dirname, './typescriptFile.ts');
const fileContents = fs.readFileSync(path.resolve(__dirname, './typescriptFile.ts'),'utf-8');

export async function generate() : Promise<void> {
  const models = await generator.generate({
    fileContents, 
    baseFile: file
  });

  for (const model of models) {
    console.log(model.result);
  }
}

export async function generateWithOptions() : Promise<void> {
  const models = await generatorWithOptions.generate({
    fileContents, 
    baseFile: file
  });

  for (const model of models) {
    console.log(model.result);
  }
}

generate();
generateWithOptions();
