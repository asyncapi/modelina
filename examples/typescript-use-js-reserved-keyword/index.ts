import { TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator({
  useJavascriptReservedKeywords: true
});
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    person: {
      type: 'object',
      additionalProperties: false,
      properties: {
        location: {
          type: 'string'
        }
      }
    }
  }
};

export async function generate(): Promise<void> {
  const models = await generator.generateCompleteModels(jsonSchemaDraft7, {});
  for (const model of models) {
    console.log(model.result);
  }
}
if (require.main === module) {
  generate();
}
