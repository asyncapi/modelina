import { CSharpGenerator } from '../../src';

const generator = new CSharpGenerator({ 
  presets: [
    {
      enum: {
        item: ({model, item, content}) => {
          const hasCustomName = model.originalInput !== undefined && model.originalInput['x-enumNames'] !== undefined;
          if (hasCustomName) {
            const customName = model.originalInput['x-enumNames'][item];
            if (customName !== undefined) {
              return customName;
            }
          }
          return content;
        }
      }
    }
  ]
});

const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'OrderStatus',
  type: 'number',
  enum: [
    30,
    40,
    50,
    99
  ],
  'x-enumNames': {
    30: 'Ordered',
    40: 'UnderDelivery',
    50: 'Deliveret',
    99: 'Cancelled'
  }
};

export async function generate() : Promise<void> {
  const models = await generator.generate(jsonSchemaDraft7);
  for (const model of models) {
    console.log(model.result);
  }
}
generate();
