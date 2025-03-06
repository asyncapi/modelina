import { JavaGenerator } from '../../src';
import * as path from 'path';
import * as fs from 'fs';

const generator = new JavaGenerator();

const file = path.resolve(__dirname, './typescriptFile.ts');
const fileContents = fs.readFileSync(
  path.resolve(__dirname, './typescriptFile.ts'),
  'utf-8'
);

export async function generate(): Promise<void> {
  const models = await generator.generate({
    fileContents,
    baseFile: file
  });

  for (const model of models) {
    console.log(model.result);
  }
}

if (require.main === module) {
  generate();
}
