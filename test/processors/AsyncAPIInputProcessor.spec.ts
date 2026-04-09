import * as fs from 'node:fs';
import * as path from 'node:path';
import { Parser } from '@asyncapi/parser';
import { AsyncAPIInputProcessor } from '../../src/processors/AsyncAPIInputProcessor';
import { InputMetaModel } from '../../src/models';
import { removeEmptyPropertiesFromObjects } from '../TestUtils/GeneralUtils';

const basicDocString = fs.readFileSync(
  path.resolve(__dirname, './AsyncAPIInputProcessor/basic.json'),
  'utf8'
);
const basicV3DocString = fs.readFileSync(
  path.resolve(__dirname, './AsyncAPIInputProcessor/basic_v3.json'),
  'utf8'
);
const operationOneOf1DocString = fs.readFileSync(
  path.resolve(__dirname, './AsyncAPIInputProcessor/operation_oneof1.json'),
  'utf8'
);
const operationOneOf2DocString = fs.readFileSync(
  path.resolve(__dirname, './AsyncAPIInputProcessor/operation_oneof2.json'),
  'utf8'
);
const operationWithReply = fs.readFileSync(
  path.resolve(__dirname, './AsyncAPIInputProcessor/operation_with_reply.json'),
  'utf8'
);
const multipleMessagesInOperation = fs.readFileSync(
  path.resolve(
    __dirname,
    './AsyncAPIInputProcessor/multiple_messages_in_operation.json'
  ),
  'utf8'
);
const ymlFileURI = `file://${path.resolve(
  __dirname,
  './AsyncAPIInputProcessor/testasyncapi.yml'
)}`;
const yamlDocString = fs.readFileSync(
  path.resolve(__dirname, './AsyncAPIInputProcessor/testasyncapi.yml'),
  'utf8'
);

jest.mock('../../src/utils/LoggingInterface');

describe('AsyncAPIInputProcessor', () => {
  const parser = new Parser();

  describe('shouldProcess()', () => {
    const processor = new AsyncAPIInputProcessor();
    test('should be able to detect pure object', () => {
      const basicDoc = JSON.parse(basicDocString);
      expect(processor.shouldProcess(basicDoc)).toEqual(true);
    });
    test('should be able to detect parsed object', async () => {
      const { document } = await parser.parse(basicDocString);
      expect(processor.shouldProcess(document)).toEqual(true);
    });
    test('should be able to detect file input', () => {
      expect(processor.shouldProcess(ymlFileURI)).toEqual(true);
    });
    test('should be able to work with yaml input', () => {
      expect(processor.shouldProcess(yamlDocString)).toEqual(true);
    });
    test('should be able to process AsyncAPI 2.0.0', () => {
      const parsedObject = { asyncapi: '2.0.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should be able to process AsyncAPI 2.1.0', () => {
      const parsedObject = { asyncapi: '2.1.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should be able to process AsyncAPI 2.2.0', () => {
      const parsedObject = { asyncapi: '2.2.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should be able to process AsyncAPI 2.3.0', () => {
      const parsedObject = { asyncapi: '2.3.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should be able to process AsyncAPI 2.4.0', () => {
      const parsedObject = { asyncapi: '2.4.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should be able to process AsyncAPI 2.5.0', () => {
      const parsedObject = { asyncapi: '2.5.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should be able to process AsyncAPI 2.6.0', () => {
      const parsedObject = { asyncapi: '2.6.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should be able to process AsyncAPI 3.x', () => {
      const parsedObject = { asyncapi: '3.0.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should not be able to process unsupported AsyncAPI 2.x', () => {
      const parsedObject = { asyncapi: '2.123.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(false);
    });
  });
  describe('tryGetVersionOfDocument()', () => {
    const processor = new AsyncAPIInputProcessor();
    test('should be able to find AsyncAPI version from object', () => {
      const basicDoc = JSON.parse(basicDocString);
      expect(processor.tryGetVersionOfDocument(basicDoc)).toEqual('2.0.0');
    });
    test('should not be able to find AsyncAPI version if not present', () => {
      expect(processor.tryGetVersionOfDocument({})).toBeUndefined();
    });
    test('should be able to find AsyncAPI version from parsed document', async () => {
      const { document } = await parser.parse(basicDocString);
      expect(processor.tryGetVersionOfDocument(document)).toEqual('2.0.0');
    });
    test('should be able to find AsyncAPI version for v3', () => {
      const basicDoc = JSON.parse(basicV3DocString);
      expect(processor.tryGetVersionOfDocument(basicDoc)).toEqual('3.0.0');
    });
  });
  describe('isFromParser()', () => {
    test('should be able to detect pure object', () => {
      const basicDoc = JSON.parse(basicDocString);
      expect(AsyncAPIInputProcessor.isFromParser(basicDoc)).toEqual(false);
    });
    test('should be able to detect parsed object', async () => {
      const { document } = await parser.parse(basicDocString);
      expect(AsyncAPIInputProcessor.isFromParser(document)).toEqual(true);
    });
  });

  describe('process()', () => {
    test('should throw error when trying to process empty schema', async () => {
      const processor = new AsyncAPIInputProcessor();
      await expect(processor.process({})).rejects.toThrow(
        'Input is not an AsyncAPI document so it cannot be processed.'
      );
    });

    test('should throw error when trying to process wrong schema', async () => {
      const processor = new AsyncAPIInputProcessor();
      await expect(
        processor.process({ asyncapi: '2.5.0', nonExistingField: {} })
      ).rejects.toThrow(
        'Input is not an correct AsyncAPI document so it cannot be processed.'
      );
    });

    test('should throw error when file does not exists', async () => {
      const processor = new AsyncAPIInputProcessor();
      await expect(processor.process(`${ymlFileURI}test`)).rejects.toThrow(
        'File does not exists.'
      );
    });

    test('should be able to process pure object', async () => {
      const basicDoc = JSON.parse(basicDocString);
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(basicDoc);
      expect(
        removeEmptyPropertiesFromObjects(commonInputModel)
      ).toMatchSnapshot();
    });
    test('should be able to process pure object for v3', async () => {
      const basicDoc = JSON.parse(basicV3DocString);
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(basicDoc);
      expect(
        removeEmptyPropertiesFromObjects(commonInputModel)
      ).toMatchSnapshot();
    });

    test('should be able to process parsed objects', async () => {
      const { document } = await parser.parse(basicDocString);
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(document);
      expect(
        removeEmptyPropertiesFromObjects(commonInputModel)
      ).toMatchSnapshot();
    });

    test('should be able to process YAML file', async () => {
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(yamlDocString);
      expect(commonInputModel instanceof InputMetaModel).toBeTruthy();
      expect(
        removeEmptyPropertiesFromObjects(commonInputModel.models)
      ).toMatchSnapshot();
    });
    test('should be able to process file', async () => {
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(ymlFileURI);
      expect(commonInputModel instanceof InputMetaModel).toBeTruthy();
      expect(
        removeEmptyPropertiesFromObjects(commonInputModel.models)
      ).toMatchSnapshot();
    });
    test('should be able to process operation with reply', async () => {
      const { document } = await parser.parse(operationWithReply);
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(document);
      expect(commonInputModel instanceof InputMetaModel).toBeTruthy();
      expect(
        removeEmptyPropertiesFromObjects(commonInputModel.models)
      ).toMatchSnapshot();
    });

    test('should be able to process operation with oneOf #1', async () => {
      const { document } = await parser.parse(operationOneOf1DocString);
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(document);
      expect(
        removeEmptyPropertiesFromObjects(commonInputModel)
      ).toMatchSnapshot();
    });

    test('should be able to process operation with oneOf #2', async () => {
      const { document } = await parser.parse(operationOneOf2DocString);
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(document);
      expect(
        removeEmptyPropertiesFromObjects(commonInputModel)
      ).toMatchSnapshot();
    });

    test('should be able to process operation with multiple messages (AsyncAPI v3)', async () => {
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(
        multipleMessagesInOperation
      );
      expect(commonInputModel instanceof InputMetaModel).toBeTruthy();
      expect(Object.keys(commonInputModel.models).length).toBeGreaterThan(0);
      // Check that message payload models are generated
      expect(commonInputModel.models['WorkersCreatedEvent']).toBeDefined();
      expect(commonInputModel.models['WorkersChangedEvent']).toBeDefined();
      // Check that the oneOf wrapper is generated
      expect(commonInputModel.models['workers']).toBeDefined();
      // Snapshot the model names
      expect(Object.keys(commonInputModel.models).sort()).toMatchSnapshot();
    });

    test('should derive meaningful names from channel paths for inline payloads (v2)', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          '/user/signedup': {
            subscribe: {
              message: {
                payload: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email' }
                  }
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);

      // Should generate UserSignedupPayload from channel path
      expect(commonInputModel.models['UserSignedupPayload']).toBeDefined();
      const userSignedupModel = commonInputModel.models['UserSignedupPayload'];
      expect(userSignedupModel.name).toEqual('UserSignedupPayload');
      // Verify the model has the expected structure
      expect(Object.keys(commonInputModel.models)).toContain(
        'UserSignedupPayload'
      );
    });

    test('should derive meaningful names from channel paths for inline payloads (v3)', async () => {
      const doc = {
        asyncapi: '3.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          orderCreated: {
            address: '/orders/created',
            messages: {
              orderMessage: {
                payload: {
                  type: 'object',
                  properties: {
                    orderId: { type: 'string' },
                    amount: { type: 'number' }
                  }
                }
              }
            }
          }
        },
        operations: {
          onOrderCreated: {
            action: 'receive',
            channel: { $ref: '#/channels/orderCreated' },
            messages: [
              { $ref: '#/channels/orderCreated/messages/orderMessage' }
            ]
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);

      // In v3, the message has a name/ID, so it uses that instead of channel address
      // The message is named 'orderMessage', so the payload should be 'orderMessagePayload'
      expect(commonInputModel.models['orderMessagePayload']).toBeDefined();
      const orderMessageModel = commonInputModel.models['orderMessagePayload'];
      expect(orderMessageModel.name).toEqual('orderMessagePayload');
      // Verify the model has the expected structure
      expect(Object.keys(commonInputModel.models)).toContain(
        'orderMessagePayload'
      );
    });

    test('should handle channel paths with parameters', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          '/users/{userId}/notifications': {
            subscribe: {
              message: {
                payload: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);

      // Should skip path parameters and generate UsersNotificationsPayload
      expect(
        commonInputModel.models['UsersNotificationsPayload']
      ).toBeDefined();
    });

    test('should not create duplicate models for same component schema referenced multiple times', async () => {
      const doc = {
        asyncapi: '3.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          channel1: {
            address: 'channel1',
            messages: {
              msg1: {
                payload: { $ref: '#/components/schemas/User' }
              }
            }
          },
          channel2: {
            address: 'channel2',
            messages: {
              msg2: {
                payload: { $ref: '#/components/schemas/User' }
              }
            }
          }
        },
        components: {
          schemas: {
            User: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' }
              }
            }
          }
        },
        operations: {
          op1: {
            action: 'receive',
            channel: { $ref: '#/channels/channel1' },
            messages: [{ $ref: '#/channels/channel1/messages/msg1' }]
          },
          op2: {
            action: 'receive',
            channel: { $ref: '#/channels/channel2' },
            messages: [{ $ref: '#/channels/channel2/messages/msg2' }]
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);

      // Should only have one User model, not duplicates
      expect(commonInputModel.models['User']).toBeDefined();
      const modelNames = Object.keys(commonInputModel.models);
      const userModels = modelNames.filter((name) => name.includes('User'));
      expect(userModels).toHaveLength(1);
    });

    test('should handle nested schemas in dependencies', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                payload: {
                  $ref: '#/components/schemas/TestSchema'
                }
              }
            }
          }
        },
        components: {
          schemas: {
            TestSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' }
              },
              dependencies: {
                dep1: {
                  type: 'object',
                  properties: {
                    value: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);

      expect(commonInputModel.models['TestSchema']).toBeDefined();
      // The dependency schema should have hierarchical naming
      const schema = AsyncAPIInputProcessor.convertToInternalSchema(
        (await processor.process(doc)).originalInput.schemas()[0] as any
      ) as any;
      expect(schema.dependencies.dep1['x-modelgen-inferred-name']).toEqual(
        'TestSchemaDep1'
      );
    });

    test('should handle nested schemas in definitions', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                payload: {
                  $ref: '#/components/schemas/TestSchema'
                }
              }
            }
          }
        },
        components: {
          schemas: {
            TestSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' }
              },
              definitions: {
                def1: {
                  type: 'object',
                  properties: {
                    value: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);

      expect(commonInputModel.models['TestSchema']).toBeDefined();
      // The definition schema should have hierarchical naming
      const schema = AsyncAPIInputProcessor.convertToInternalSchema(
        (await processor.process(doc)).originalInput.schemas()[0] as any
      ) as any;
      expect(schema.definitions.def1['x-modelgen-inferred-name']).toEqual(
        'TestSchemaDef1'
      );
    });
  });

  describe('edge cases and advanced features', () => {
    test('should handle schema with enum and generate enum naming', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                payload: {
                  $ref: '#/components/schemas/TestSchema'
                }
              }
            }
          }
        },
        components: {
          schemas: {
            TestSchema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  enum: ['active', 'inactive', 'pending']
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      expect(commonInputModel.models['TestSchema']).toBeDefined();
    });

    test('should handle schema with not keyword', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                payload: {
                  type: 'object',
                  not: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      expect(Object.keys(commonInputModel.models).length).toBeGreaterThan(0);
    });

    test('should handle schema with additionalItems', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                payload: {
                  type: 'array',
                  items: [{ type: 'string' }, { type: 'number' }],
                  additionalItems: {
                    type: 'boolean'
                  }
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      expect(Object.keys(commonInputModel.models).length).toBeGreaterThan(0);
    });

    test('should handle schema with contains keyword', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                payload: {
                  type: 'array',
                  contains: {
                    type: 'string',
                    minLength: 5
                  }
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      expect(Object.keys(commonInputModel.models).length).toBeGreaterThan(0);
    });

    test('should handle schema with propertyNames keyword', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                payload: {
                  type: 'object',
                  propertyNames: {
                    pattern: '^[A-Za-z_][A-Za-z0-9_]*$'
                  }
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      expect(Object.keys(commonInputModel.models).length).toBeGreaterThan(0);
    });

    test('should handle schema with if/then/else keywords', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                payload: {
                  type: 'object',
                  properties: {
                    country: { type: 'string' }
                  },
                  if: {
                    properties: {
                      country: { const: 'USA' }
                    }
                  },
                  then: {
                    properties: {
                      postalCode: { pattern: '[0-9]{5}' }
                    }
                  },
                  else: {
                    properties: {
                      postalCode: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      expect(Object.keys(commonInputModel.models).length).toBeGreaterThan(0);
    });

    test('should handle schema with additionalProperties as object', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                payload: {
                  $ref: '#/components/schemas/TestSchema'
                }
              }
            }
          }
        },
        components: {
          schemas: {
            TestSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' }
              },
              additionalProperties: {
                type: 'object',
                properties: {
                  value: { type: 'string' }
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      expect(commonInputModel.models['TestSchema']).toBeDefined();

      // Check that additionalProperties schema gets proper naming
      const schema = AsyncAPIInputProcessor.convertToInternalSchema(
        (await processor.process(doc)).originalInput.schemas()[0] as any
      ) as any;
      expect(schema.additionalProperties['x-modelgen-inferred-name']).toEqual(
        'TestSchemaAdditionalProperty'
      );
    });

    test('should handle array items as array of schemas', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                payload: {
                  $ref: '#/components/schemas/TestSchema'
                }
              }
            }
          }
        },
        components: {
          schemas: {
            TestSchema: {
              type: 'object',
              properties: {
                tuple: {
                  type: 'array',
                  items: [
                    { type: 'string' },
                    { type: 'number' },
                    { type: 'boolean' }
                  ]
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      expect(commonInputModel.models['TestSchema']).toBeDefined();
    });

    test('should handle array items as single schema', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                payload: {
                  $ref: '#/components/schemas/TestSchema'
                }
              }
            }
          }
        },
        components: {
          schemas: {
            TestSchema: {
              type: 'object',
              properties: {
                items: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      expect(commonInputModel.models['TestSchema']).toBeDefined();

      // Check that array item schema gets proper naming
      const schema = AsyncAPIInputProcessor.convertToInternalSchema(
        (await processor.process(doc)).originalInput.schemas()[0] as any
      ) as any;
      expect(schema.properties.items.items['x-modelgen-inferred-name']).toEqual(
        'TestSchemaItemsItem'
      );
    });

    test('should handle patternProperties', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                payload: {
                  $ref: '#/components/schemas/TestSchema'
                }
              }
            }
          }
        },
        components: {
          schemas: {
            TestSchema: {
              type: 'object',
              patternProperties: {
                '^S_': {
                  type: 'string'
                },
                '^I_': {
                  type: 'integer'
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      expect(commonInputModel.models['TestSchema']).toBeDefined();
    });

    test('should handle schema with title field', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                payload: {
                  title: 'CustomTitleSchema',
                  type: 'object',
                  properties: {
                    name: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      // Should use the title as the schema name
      expect(commonInputModel.models['CustomTitleSchema']).toBeDefined();
    });

    test('should handle boolean schema in convertToInternalSchema', () => {
      // Boolean schemas are handled directly in convertToInternalSchema
      const booleanSchema = true;
      const result = AsyncAPIInputProcessor.convertToInternalSchema(
        booleanSchema as any
      );
      expect(result).toBe(true);

      const falseSchema = false;
      const result2 = AsyncAPIInputProcessor.convertToInternalSchema(
        falseSchema as any
      );
      expect(result2).toBe(false);
    });

    test('should handle operation with reply channel messages', async () => {
      const doc = {
        asyncapi: '3.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          requestChannel: {
            address: 'request',
            messages: {
              requestMsg: {
                payload: {
                  type: 'object',
                  properties: {
                    query: { type: 'string' }
                  }
                }
              }
            }
          },
          replyChannel: {
            address: 'reply',
            messages: {
              replyMsg: {
                payload: {
                  type: 'object',
                  properties: {
                    result: { type: 'string' }
                  }
                }
              }
            }
          }
        },
        operations: {
          requestOp: {
            action: 'send',
            channel: { $ref: '#/channels/requestChannel' },
            messages: [
              { $ref: '#/channels/requestChannel/messages/requestMsg' }
            ],
            reply: {
              channel: { $ref: '#/channels/replyChannel' }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      expect(commonInputModel.models['requestMsgPayload']).toBeDefined();
      expect(commonInputModel.models['replyMsgPayload']).toBeDefined();
    });

    test('should handle custom resolver options', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                payload: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const customResolver = {
        schema: 'custom',
        order: 1,
        canRead: () => false,
        read: () => Promise.resolve('')
      };
      const commonInputModel = await processor.process(doc, {
        asyncapi: {
          __unstable: {
            resolver: {
              resolvers: [customResolver]
            }
          }
        }
      });
      expect(Object.keys(commonInputModel.models).length).toBeGreaterThan(0);
    });

    test('should handle document without channels (allMessages fallback)', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {},
        components: {
          messages: {
            TestMessage: {
              payload: {
                type: 'object',
                properties: {
                  data: { type: 'string' }
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      // Should process messages even without channels
      expect(Object.keys(commonInputModel.models).length).toBeGreaterThan(0);
    });

    test('should handle message without payload', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                name: 'EmptyMessage'
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      // Should handle gracefully even without payload
      expect(commonInputModel).toBeDefined();
    });

    test('should handle schema ID that looks like component name', async () => {
      const { document } = await parser.parse(
        JSON.stringify({
          asyncapi: '2.0.0',
          info: { title: 'Test', version: '1.0.0' },
          channels: {
            test: {
              subscribe: {
                message: {
                  payload: {
                    $ref: '#/components/schemas/Order'
                  }
                }
              }
            }
          },
          components: {
            schemas: {
              Order: {
                type: 'object',
                properties: {
                  id: { type: 'string' }
                }
              }
            }
          }
        })
      );
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(document);
      expect(commonInputModel.models['Order']).toBeDefined();
    });

    test('should handle operation reply with no messages (fallback to channel messages)', async () => {
      const doc = {
        asyncapi: '3.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          requestChannel: {
            address: 'request',
            messages: {
              requestMsg: {
                payload: {
                  type: 'object',
                  properties: {
                    query: { type: 'string' }
                  }
                }
              }
            }
          },
          replyChannel: {
            address: 'reply',
            messages: {
              replyMsg: {
                payload: {
                  type: 'object',
                  properties: {
                    result: { type: 'string' }
                  }
                }
              }
            }
          }
        },
        operations: {
          requestOp: {
            action: 'send',
            channel: { $ref: '#/channels/requestChannel' },
            messages: [
              { $ref: '#/channels/requestChannel/messages/requestMsg' }
            ],
            reply: {
              channel: { $ref: '#/channels/replyChannel' },
              messages: []
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      // Should fallback to channel messages when reply has no messages
      expect(commonInputModel.models['replyMsgPayload']).toBeDefined();
    });

    test('should handle multiple messages creating oneOf wrapper', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          events: {
            subscribe: {
              message: {
                oneOf: [
                  {
                    payload: {
                      type: 'object',
                      properties: {
                        eventType: { const: 'created' }
                      }
                    }
                  },
                  {
                    payload: {
                      type: 'object',
                      properties: {
                        eventType: { const: 'updated' }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      // Should create models for each message variant
      expect(Object.keys(commonInputModel.models).length).toBeGreaterThan(0);
    });

    test('should handle legacy inferred name parameter in convertToInternalSchema', async () => {
      const { document } = await parser.parse(
        JSON.stringify({
          asyncapi: '2.0.0',
          info: { title: 'Test', version: '1.0.0' },
          channels: {
            test: {
              subscribe: {
                message: {
                  payload: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        })
      );
      const schema = document
        ?.channels()
        .get('test')
        ?.operations()[0]
        .messages()[0]
        ?.payload();
      // Test with legacy string parameter
      const result = AsyncAPIInputProcessor.convertToInternalSchema(
        schema as any,
        new Map(),
        'CustomInferredName'
      );
      expect((result as any)['x-modelgen-inferred-name']).toBeDefined();
    });

    test('should handle schema with x-modelgen-source-file extension', async () => {
      const { document } = await parser.parse(
        JSON.stringify({
          asyncapi: '2.0.0',
          info: { title: 'Test', version: '1.0.0' },
          channels: {
            test: {
              subscribe: {
                message: {
                  payload: {
                    type: 'object',
                    'x-modelgen-source-file': 'CustomSourceFile',
                    properties: {
                      name: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        })
      );
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(document);
      // Should use source file name if available
      expect(Object.keys(commonInputModel.models).length).toBeGreaterThan(0);
    });

    test('should handle error when extracting component schema keys', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                payload: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      // Should handle gracefully even if schema extraction fails
      const commonInputModel = await processor.process(doc);
      expect(commonInputModel).toBeDefined();
    });

    test('should prefer better names over synthetic names in duplicate detection', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                payload: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          }
        },
        components: {
          schemas: {
            User: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                profile: {
                  oneOf: [{ $ref: '#/components/schemas/User' }]
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      // Should keep User name instead of synthetic OneOfOption name
      expect(commonInputModel.models['User']).toBeDefined();
    });

    test('should handle model name collision with warning', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test1: {
            subscribe: {
              message: {
                payload: {
                  title: 'SameName',
                  type: 'object',
                  properties: {
                    field1: { type: 'string' }
                  }
                }
              }
            }
          },
          test2: {
            subscribe: {
              message: {
                payload: {
                  title: 'SameName',
                  type: 'object',
                  properties: {
                    field2: { type: 'number' }
                  }
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      // Should handle name collision (second one overwrites first with warning)
      expect(commonInputModel.models['SameName']).toBeDefined();
    });
  });

  describe('advanced naming scenarios', () => {
    test('should handle property name without parent', async () => {
      const { document } = await parser.parse(
        JSON.stringify({
          asyncapi: '2.0.0',
          info: { title: 'Test', version: '1.0.0' },
          channels: {
            test: {
              subscribe: {
                message: {
                  payload: {
                    type: 'object',
                    properties: {
                      standalone: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            }
          }
        })
      );
      const schema = document
        ?.channels()
        .get('test')
        ?.operations()[0]
        .messages()[0]
        ?.payload();
      const result = AsyncAPIInputProcessor.convertToInternalSchema(
        schema as any
      );
      expect((result as any)['x-modelgen-inferred-name']).toBeDefined();
    });

    test('should handle enum with parent context', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                payload: {
                  $ref: '#/components/schemas/TestSchema'
                }
              }
            }
          }
        },
        components: {
          schemas: {
            TestSchema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  enum: ['active', 'inactive']
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      const schema = AsyncAPIInputProcessor.convertToInternalSchema(
        commonInputModel.originalInput.schemas()[0] as any
      ) as any;
      // Enum property should have proper naming
      expect(schema.properties.status['x-modelgen-inferred-name']).toContain(
        'Status'
      );
    });

    test('should handle anonymous message ID fallback to channel name', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          '/events/stream': {
            subscribe: {
              message: {
                payload: {
                  type: 'object',
                  properties: {
                    data: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      // Should use channel-derived name for anonymous message
      expect(commonInputModel.models['EventsStreamPayload']).toBeDefined();
    });

    test('should use message name instead of AnonymousSchema for named message with anonymous payload (issue #1996)', async () => {
      // This is the exact scenario from issue #1996
      // When a message is defined in components/messages with a name (e.g., UserSignedUp)
      // but its payload is an anonymous inline schema, the generated model should use
      // the message name instead of AnonymousSchema_1
      const doc = {
        asyncapi: '2.2.0',
        info: {
          title: 'Account Service',
          version: '1.0.0',
          description:
            'This service is in charge of processing user signups'
        },
        channels: {
          'user/signedup': {
            subscribe: {
              message: {
                $ref: '#/components/messages/UserSignedUp'
              }
            }
          }
        },
        components: {
          messages: {
            UserSignedUp: {
              payload: {
                type: 'object',
                properties: {
                  displayName: {
                    type: 'string',
                    description: 'Name of the user'
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    description: 'Email of the user'
                  }
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      const modelNames = Object.keys(commonInputModel.models);

      // Should NOT generate AnonymousSchema_1 as the model name
      const anonymousModels = modelNames.filter((name) =>
        name.toLowerCase().includes('anonymous')
      );
      expect(anonymousModels).toHaveLength(0);

      // Should generate a meaningful model name derived from message or channel context
      expect(modelNames.length).toBeGreaterThan(0);
    });

    test('should use message name for anonymous payload in v3 with named messages', async () => {
      const doc = {
        asyncapi: '3.0.0',
        info: { title: 'Account Service', version: '1.0.0' },
        channels: {
          userSignedUp: {
            address: 'user/signedup',
            messages: {
              UserSignedUpMessage: {
                payload: {
                  type: 'object',
                  properties: {
                    displayName: { type: 'string' },
                    email: { type: 'string', format: 'email' }
                  }
                }
              }
            }
          }
        },
        operations: {
          onUserSignedUp: {
            action: 'receive',
            channel: { $ref: '#/channels/userSignedUp' },
            messages: [
              {
                $ref: '#/channels/userSignedUp/messages/UserSignedUpMessage'
              }
            ]
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      const modelNames = Object.keys(commonInputModel.models);

      // Should NOT generate AnonymousSchema as the model name
      const anonymousModels = modelNames.filter((name) =>
        name.toLowerCase().includes('anonymous')
      );
      expect(anonymousModels).toHaveLength(0);

      // Should use the message name for payload naming
      expect(
        commonInputModel.models['UserSignedUpMessagePayload']
      ).toBeDefined();
    });

    test('should use message name for multiple named messages with anonymous payloads', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          events: {
            subscribe: {
              message: {
                oneOf: [
                  {
                    name: 'UserCreated',
                    payload: {
                      type: 'object',
                      properties: {
                        userId: { type: 'string' }
                      }
                    }
                  },
                  {
                    name: 'UserUpdated',
                    payload: {
                      type: 'object',
                      properties: {
                        userId: { type: 'string' },
                        updatedFields: {
                          type: 'array',
                          items: { type: 'string' }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      const modelNames = Object.keys(commonInputModel.models);

      // Should generate models without AnonymousSchema naming
      expect(modelNames.length).toBeGreaterThan(0);
      // Should have the oneOf wrapper for the channel
      const anonymousModels = modelNames.filter((name) =>
        name.toLowerCase().includes('anonymousschema')
      );
      // Anonymous schema naming should be avoided where possible
      expect(anonymousModels.length).toBeLessThanOrEqual(0);
    });

    test('should handle schema with only property name in context', async () => {
      const { document } = await parser.parse(
        JSON.stringify({
          asyncapi: '2.0.0',
          info: { title: 'Test', version: '1.0.0' },
          channels: {
            test: {
              subscribe: {
                message: {
                  payload: {
                    type: 'object',
                    properties: {
                      nested: {
                        type: 'object',
                        properties: {
                          deep: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        })
      );
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(document);
      expect(Object.keys(commonInputModel.models).length).toBeGreaterThan(0);
    });

    test('should handle schema name preference in duplicate detection', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                payload: {
                  $ref: '#/components/schemas/UserProfile'
                }
              }
            }
          }
        },
        components: {
          schemas: {
            UserProfile: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      // Should use the component schema name
      expect(commonInputModel.models['UserProfile']).toBeDefined();
    });

    test('should handle channel with empty address', async () => {
      const doc = {
        asyncapi: '3.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          emptyChannel: {
            address: '',
            messages: {
              msg: {
                payload: {
                  type: 'object',
                  properties: {
                    data: { type: 'string' }
                  }
                }
              }
            }
          }
        },
        operations: {
          op: {
            action: 'receive',
            channel: { $ref: '#/channels/emptyChannel' },
            messages: [{ $ref: '#/channels/emptyChannel/messages/msg' }]
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      // Should handle empty channel address gracefully
      expect(Object.keys(commonInputModel.models).length).toBeGreaterThan(0);
    });

    test('should handle null or undefined schema json in hashSchema', () => {
      // Test edge cases in hashSchema
      const hash1 = (AsyncAPIInputProcessor as any).hashSchema(null);
      expect(hash1).toBe('');

      const hash2 = (AsyncAPIInputProcessor as any).hashSchema(undefined);
      expect(hash2).toBe('');

      const hash3 = (AsyncAPIInputProcessor as any).hashSchema('not an object');
      expect(hash3).toBe('');
    });

    test('should handle schema with anonymous title', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                payload: {
                  title: 'anonymous-schema',
                  type: 'object',
                  properties: {
                    name: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);
      // Should not use anonymous title
      expect(Object.keys(commonInputModel.models).length).toBeGreaterThan(0);
    });
  });

  describe('convertToInternalSchema()', () => {
    test('should work', async () => {
      const basicDocString = fs.readFileSync(
        path.resolve(
          __dirname,
          './AsyncAPIInputProcessor/schema_name_reflection.json'
        ),
        'utf8'
      );
      const { document } = await parser.parse(basicDocString);
      const schema = document
        ?.channels()
        .get('/user/signedup')
        ?.operations()[0]
        .messages()[0]
        ?.payload();
      const expected = AsyncAPIInputProcessor.convertToInternalSchema(
        schema as any
      ) as any;

      // root
      expect(expected['x-modelgen-inferred-name']).toEqual('MainSchema');

      // properties - now using hierarchical naming based on property paths
      expect(expected.properties.prop['x-modelgen-inferred-name']).toEqual(
        'MainSchemaProp'
      );
      expect(expected.properties.allOfCase['x-modelgen-inferred-name']).toEqual(
        'MainSchemaAllOfCase'
      );
      expect(
        expected.properties.allOfCase.allOf[0]['x-modelgen-inferred-name']
      ).toEqual('MainSchemaAllOfCaseAllOfOption0');
      expect(
        expected.properties.allOfCase.allOf[1]['x-modelgen-inferred-name']
      ).toEqual('MainSchemaAllOfCaseAllOfOption1');
      expect(expected.properties.object['x-modelgen-inferred-name']).toEqual(
        'MainSchemaObject'
      );
      expect(
        expected.properties.object.properties.prop['x-modelgen-inferred-name']
      ).toEqual('MainSchemaObjectProp');
      expect(
        expected.properties.propWithObject['x-modelgen-inferred-name']
      ).toEqual('MainSchemaPropWithObject');
      expect(
        expected.properties.propWithObject.properties.propWithObject[
          'x-modelgen-inferred-name'
        ]
      ).toEqual('MainSchemaPropWithObjectPropWithObject');

      // patternProperties - now using hierarchical naming
      expect(
        expected.patternProperties.patternProp['x-modelgen-inferred-name']
      ).toEqual('MainSchemaPatternProperty');

      // dependencies
      expect(expected.dependencies.dep['x-modelgen-inferred-name']).toEqual(
        'MainSchemaDep'
      );

      // definitions
      expect(expected.definitions.def['x-modelgen-inferred-name']).toEqual(
        'MainSchemaDef'
      );
      expect(
        expected.definitions.oneOfCase['x-modelgen-inferred-name']
      ).toEqual('MainSchemaOneOfCase');
      expect(
        expected.definitions.oneOfCase.oneOf[0]['x-modelgen-inferred-name']
      ).toEqual('MainSchemaOneOfCaseOneOfOption0');
      expect(
        expected.definitions.oneOfCase.oneOf[1]['x-modelgen-inferred-name']
      ).toEqual('MainSchemaOneOfCaseOneOfOption1');

      // anyOf
      expect(expected.anyOf[0]['x-modelgen-inferred-name']).toEqual(
        'MainSchemaAnyOfOption0'
      );
      expect(expected.anyOf[1]['x-modelgen-inferred-name']).toEqual(
        'MainSchemaAnyOfOption1'
      );
      expect(
        expected.anyOf[1].properties.prop['x-modelgen-inferred-name']
      ).toEqual('MainSchemaAnyOfOption1Prop');
    });
    test('should correctly convert when schema has more than one properties referencing one other schema', async () => {
      const basicDocString = fs.readFileSync(
        path.resolve(
          __dirname,
          './AsyncAPIInputProcessor/schema_with_2_properties_referencing_one_schema.json'
        ),
        'utf8'
      );
      const { document } = await parser.parse(basicDocString);
      const schema = document
        ?.channels()
        .get('/user/signedup')
        ?.operations()[0]
        ?.messages()[0]
        ?.payload();
      const result = AsyncAPIInputProcessor.convertToInternalSchema(
        schema as any
      ) as any;

      expect(result.properties['lastName']).not.toEqual({});
      expect(result.properties['firstName']).toEqual(
        result.properties['lastName']
      );
    });
  });

  describe('x-modelgen-inferred-name extension', () => {
    test('should respect user-provided x-modelgen-inferred-name for inline enum', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                payload: {
                  $ref: '#/components/schemas/TestPayload'
                }
              }
            }
          }
        },
        components: {
          schemas: {
            TestPayload: {
              type: 'object',
              properties: {
                status: {
                  'x-modelgen-inferred-name': 'Status',
                  type: 'string',
                  enum: ['active', 'inactive']
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);

      // The enum should be named "Status", NOT "TestPayloadStatusEnum"
      const schema = AsyncAPIInputProcessor.convertToInternalSchema(
        commonInputModel.originalInput.schemas()[0] as any
      ) as any;
      expect(schema.properties.status['x-modelgen-inferred-name']).toEqual(
        'Status'
      );
    });

    test('should respect user-provided x-modelgen-inferred-name for inline object', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                payload: {
                  $ref: '#/components/schemas/TestPayload'
                }
              }
            }
          }
        },
        components: {
          schemas: {
            TestPayload: {
              type: 'object',
              properties: {
                nested: {
                  'x-modelgen-inferred-name': 'CustomNestedObject',
                  type: 'object',
                  properties: {
                    value: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);

      // The nested object should be named "CustomNestedObject", NOT "TestPayloadNested"
      const schema = AsyncAPIInputProcessor.convertToInternalSchema(
        commonInputModel.originalInput.schemas()[0] as any
      ) as any;
      expect(schema.properties.nested['x-modelgen-inferred-name']).toEqual(
        'CustomNestedObject'
      );
    });

    test('should still use context-based naming for schemas without the extension', async () => {
      const doc = {
        asyncapi: '2.0.0',
        info: { title: 'Test', version: '1.0.0' },
        channels: {
          test: {
            subscribe: {
              message: {
                payload: {
                  $ref: '#/components/schemas/TestPayload'
                }
              }
            }
          }
        },
        components: {
          schemas: {
            TestPayload: {
              type: 'object',
              properties: {
                statusWithExtension: {
                  'x-modelgen-inferred-name': 'MyCustomStatus',
                  type: 'string',
                  enum: ['a', 'b']
                },
                statusWithoutExtension: {
                  type: 'string',
                  enum: ['x', 'y']
                }
              }
            }
          }
        }
      };
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(doc);

      const schema = AsyncAPIInputProcessor.convertToInternalSchema(
        commonInputModel.originalInput.schemas()[0] as any
      ) as any;

      // Schema WITH extension should use the provided name
      expect(
        schema.properties.statusWithExtension['x-modelgen-inferred-name']
      ).toEqual('MyCustomStatus');

      // Schema WITHOUT extension should use context-based inferred name
      expect(
        schema.properties.statusWithoutExtension['x-modelgen-inferred-name']
      ).toEqual('TestPayloadStatusWithoutExtensionEnum');
    });
  });
});
