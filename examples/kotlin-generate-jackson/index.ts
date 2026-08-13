import { KotlinGenerator, KOTLIN_JACKSON_PRESET } from '../../src';

const generator = new KotlinGenerator({
  presets: [KOTLIN_JACKSON_PRESET]
});

const orderSchema = {
  $id: 'Order',
  type: 'object',
  additionalProperties: false,
  properties: {
    order_id: {
      type: 'string'
    },
    status: {
      $id: 'OrderStatus',
      type: 'string',
      enum: ['in-progress', 'done']
    }
  },
  required: ['order_id', 'status']
};

export async function generate(): Promise<void> {
  const models = await generator.generate(orderSchema);
  console.log(
    models.map((model) => model.result.replace(/[ \t]+$/gm, '')).join('\n\n')
  );
}

if (require.main === module) {
  generate();
}
