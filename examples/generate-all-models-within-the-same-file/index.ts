import { JavaFileGenerator } from '../../src';
import { promises as fsPromises } from 'fs';

const generator = new JavaFileGenerator();
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    email: {
      type: 'string',
      enum: ['example1@test.com', 'example2@test.com']
    }
  }
};
export async function generate(): Promise<void> {
  const outputFile = './output';
  const models = await generator.generate(jsonSchemaDraft7);
  const modelCode = models.map((outputModel) => {
    return outputModel.result;
  });
  const imports = models.map((outputModel) => {
    return outputModel.dependencies;
  });
  const uniqueImports = [...new Set(imports)];
  const codeWithImports = `${uniqueImports.join('\n')}
  ${modelCode.join('\n')}`;

  await fsPromises.writeFile(outputFile, codeWithImports);
  console.log(codeWithImports);
}
if (require.main === module) {
  generate();
}
