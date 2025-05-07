import { JavaGenerator } from '../../src';

const generator = new JavaGenerator({
  useModelNameAsConstForDiscriminatorProperty: true
});
const jsonSchemaDraft7 = {
  asyncapi: '2.5.0',
  info: {
    title: 'CloudEvent example',
    version: '1.0.0'
  },
  channels: {
    owner: {
      publish: {
        message: {
          $ref: '#/components/messages/Owner'
        }
      }
    }
  },
  components: {
    messages: {
      Owner: {
        payload: {
          $ref: '#/components/schemas/Owner'
        }
      }
    },
    schemas: {
      Owner: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          pets: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Pet'
            }
          }
        }
      },
      Pet: {
        title: 'Pet',
        type: 'object',
        discriminator: 'petType',
        properties: {
          petType: {
            type: 'string'
          }
        },
        required: ['petType'],
        oneOf: [
          {
            $ref: '#/components/schemas/Fish'
          },
          {
            $ref: '#/components/schemas/Bird'
          },
          {
            $ref: '#/components/schemas/FlyingFish'
          }
        ]
      },
      Bird: {
        title: 'Bird',
        properties: {
          breed: {
            type: 'string'
          }
        },
        allOf: [
          {
            $ref: '#/components/schemas/Pet'
          }
        ]
      },
      Fish: {
        title: 'Fish',
        allOf: [
          {
            $ref: '#/components/schemas/Pet'
          }
        ]
      },
      FlyingFish: {
        title: 'FlyingFish',
        type: 'object',
        allOf: [
          {
            $ref: '#/components/schemas/Fish'
          }
        ],
        properties: {
          hasWings: {
            type: 'boolean'
          }
        }
      }
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
