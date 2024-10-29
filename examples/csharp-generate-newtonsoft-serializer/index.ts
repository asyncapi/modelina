import {
  CSharpGenerator,
  CSHARP_NEWTONSOFT_SERIALIZER_PRESET
} from '../../src';

const generator = new CSharpGenerator({
  presets: [{
    preset:CSHARP_NEWTONSOFT_SERIALIZER_PRESET,
    options: {
      enforceRequired:true
    }
  }]
});

const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  required:["email"],
  properties: {    
    email: {
      type: 'string',
      format: 'email'
    },
    name: {
      type: 'string'      
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
