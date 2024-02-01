import path from 'path';
import { TypeScriptFileGenerator, TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator();
const fileGenerator = new TypeScriptFileGenerator();

export async function generate(): Promise<void> {
  const fileUri = `file://${path.resolve(__dirname, './testasyncapi.yml')}`;
  const models = await generator.generate(fileUri);
  for (const model of models) {
    console.log(model.result);
  }
}

export async function generateToFiles(): Promise<void> {
  const outputFolder = './examples/file-uri-input/output';
  const fileUri = `file://${path.resolve(__dirname, './testasyncapi.yml')}`;
  const models = await fileGenerator.generateToFiles(fileUri, outputFolder);
  for (const model of models) {
    console.log(model.result);
  }
}
if (require.main === module) {
  generate();
  generateToFiles();
}
