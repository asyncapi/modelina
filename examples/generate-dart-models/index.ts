import { DartFileGenerator, DART_JSON_PRESET} from '../../src';

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

const generator = new DartFileGenerator({ presets: [DART_JSON_PRESET] });

export async function generate() : Promise<void> {
  const outputFolder = './examples/generate-dart-to-files/output/test';
  const modelGenerationOptions = {
    packageName: 'test'
  };
  const models = await generator.generateToFiles(jsonSchemaDraft7, outputFolder, modelGenerationOptions);
  for (const model of models) {
    console.log(model.result);
  }
}
generate();
