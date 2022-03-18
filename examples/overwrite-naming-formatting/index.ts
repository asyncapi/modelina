import { TypeScriptGenerator } from '../../src';
import { constantCase } from 'change-case';

const generator = new TypeScriptGenerator({
  constraints: {
    naming: {
      NAMING_FORMATTER: (name) => {
        return constantCase(name);
      }
    }
  }
});

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

export async function generate() : Promise<void> {
  const models = await generator.generate(jsonSchemaDraft7);
  for (const model of models) {
    console.log(model.result);
  }
}
generate();
