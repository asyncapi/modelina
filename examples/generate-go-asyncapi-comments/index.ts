import {
  GoGenerator,
  GO_DESCRIPTION_PRESET,
  GO_COMMON_PRESET,
  GoCommonPresetOptions
} from '../../src';

const options: GoCommonPresetOptions = { addJsonTag: true };
const generator = new GoGenerator({
  presets: [GO_DESCRIPTION_PRESET, { preset: GO_COMMON_PRESET, options }]
});

const asyncAPIDocument = {
  asyncapi: '3.0.0',
  info: {
    title: 'inventoryService',
    version: '2.1.0'
  },
  channels: {
    inventory: {
      address: '/inventory',
      messages: {
        updateStock: {
          summary: 'Update stock levels',
          payload: {
            title: 'stockUpdatePayload',
            type: 'object',
            description: 'Payload for updating stock information',
            required: ['productId'],
            additionalProperties: false,
            properties: {
              productId: {
                type: 'string'
              },
              quantity: {
                type: 'integer',
                description: 'The updated quantity of the product'
              },
              location: {
                type: 'string',
                description: 'Warehouse location of the product'
              }
            }
          }
        }
      }
    },
    alerts: {
      address: '/alerts',
      messages: {
        lowStockAlert: {
          summary: 'Low stock level alert',
          payload: {
            title: 'lowStockPayload',
            type: 'object',
            description: 'Payload for low stock alerts',
            required: ['productId', 'threshold'],
            additionalProperties: false,
            properties: {
              productId: {
                type: 'string'
              },
              threshold: {
                type: 'integer',
                description: 'The stock level threshold'
              },
              currentStock: {
                type: 'integer',
                description: 'The current stock level'
              }
            }
          }
        }
      }
    }
  },
  operations: {
    updateInventory: {
      title: 'Update Inventory Operation',
      summary: 'Operation to update inventory stock levels',
      channel: {
        $ref: '#/channels/inventory'
      },
      action: 'send',
      messages: [
        {
          $ref: '#/channels/inventory/messages/updateStock'
        }
      ]
    },
    notifyLowStock: {
      title: 'Notify Low Stock Operation',
      summary: 'Operation to notify when stock is low',
      channel: {
        $ref: '#/channels/alerts'
      },
      action: 'receive',
      messages: [
        {
          $ref: '#/channels/alerts/messages/lowStockAlert'
        }
      ]
    }
  }
};

export async function generate(): Promise<void> {
  const models = await generator.generate(asyncAPIDocument);
  for (const model of models) {
    console.log(model.result);
  }
}

if (require.main === module) {
  generate();
}
