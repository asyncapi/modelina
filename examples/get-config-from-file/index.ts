import { FileHelpers, TypeScriptGenerator, TypeScriptOptions } from '../../src';

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

async function main() {
  try {
    const config: { config: TypeScriptOptions } =
      await FileHelpers.getConfigFromFile('./modelina.config.alternate.js');
    const tsGen = new TypeScriptGenerator(config.config);
    const models = await tsGen.generate(jsonSchemaDraft7);
    for (const model of models) {
      console.log(model.result);
    }
  } catch (err) {
    console.log(err);
  }
}

main();
