import { JavaFileGenerator } from '../../src';

const generator = new JavaFileGenerator();
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    email: {
      type: 'string',
      format: 'email'
    }
  }
};

export async function generate(): Promise<void> {
  const outputFolder = './examples/generate-to-files/output';
  const modelGenerationOptions = {
    packageName: 'TestPackageName'
  };
  const models = await generator.generateToFiles(
    jsonSchemaDraft7,
    outputFolder,
    modelGenerationOptions
  );
  for (const model of models) {
    console.log(model.result);
  }
}
if (require.main === module) {
  generate();
}
