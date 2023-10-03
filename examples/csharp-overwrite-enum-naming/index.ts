import { CSharpGenerator } from '../../src';

const generator = new CSharpGenerator({
  constraints: {
    enumKey: ({ enumModel, enumKey }) => {
      // Lets see if an enum has an associated custom name
      const hasCustomName = enumModel?.originalInput?.['x-enumNames'] !== undefined;
      if (hasCustomName) {
        // Lets see if the specific value has an associated name
        const customName = enumModel.originalInput['x-enumNames'][enumKey];
        if (customName !== undefined) {
          return customName;
        }
      }
    }
  }
});

const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'OrderStatus',
  type: 'number',
  enum: [30, 40, 50, 99],
  'x-enumNames': {
    30: 'Ordered',
    40: 'UnderDelivery',
    50: 'Delivered',
    99: 'Cancelled'
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
