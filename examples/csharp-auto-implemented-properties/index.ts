import { CSharpGenerator, CSHARP_DEFAULT_PRESET } from '../../src';

const generator = new CSharpGenerator({
  presets: [
    {
      preset: CSHARP_DEFAULT_PRESET,
      options: {
        autoImplementedProperties: true
      }
    }]
});

const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  required: ['nonNullNumber', 'nonNullString', 'nonNullArray'],
  properties: {
    nullArray: {
      type: 'array',
      items: {
        type: 'string',
        format: 'email'
      }
    },
    nullString: {
      type: 'string'
    },
    nullNumber: {
      type: 'number'
    },
    nonNullArray: {
      type: 'array',
      items: {
        type: 'string',
        format: 'email'
      }
    },
    nonNullString: {
      type: 'string'
    },
    nonNullNumber: {
      type: 'number'
    }
  }
};

export async function generate(): Promise<void> {
  const models = await generator.generate(jsonSchemaDraft7);
  for (const model of models) {
    console.log(model.result);
  }
}
if (require.main === module) {
  generate();
}
