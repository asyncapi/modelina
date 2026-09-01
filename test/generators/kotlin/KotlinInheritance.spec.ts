import { KotlinGenerator, KOTLIN_JACKSON_PRESET } from '../../../src';

describe('Kotlin inheritance and discriminators', () => {
  test('should render inherited object unions with Jackson subtype metadata', async () => {
    const document = {
      asyncapi: '3.0.0',
      info: {
        title: 'Animals',
        version: '1.0.0'
      },
      channels: {
        animals: {
          address: 'animals',
          messages: {
            Dog: { $ref: '#/components/messages/Dog' },
            Cat: { $ref: '#/components/messages/Cat' }
          }
        }
      },
      operations: {
        receiveAnimals: {
          action: 'receive',
          channel: { $ref: '#/channels/animals' },
          messages: [
            { $ref: '#/channels/animals/messages/Dog' },
            { $ref: '#/channels/animals/messages/Cat' }
          ]
        }
      },
      components: {
        messages: {
          Dog: {
            payload: { $ref: '#/components/schemas/Dog' }
          },
          Cat: {
            payload: { $ref: '#/components/schemas/Cat' }
          }
        },
        schemas: {
          Pet: {
            type: 'object',
            discriminator: 'kind',
            'x-discriminator-mapping': {
              dog: '#/components/schemas/Dog',
              cat: '#/components/schemas/Cat'
            },
            required: ['kind'],
            properties: {
              kind: { type: 'string' }
            }
          },
          Dog: {
            allOf: [{ $ref: '#/components/schemas/Pet' }, { type: 'object' }],
            required: ['bark'],
            properties: {
              bark: { type: 'boolean' }
            }
          },
          Cat: {
            allOf: [{ $ref: '#/components/schemas/Pet' }, { type: 'object' }],
            required: ['lives'],
            properties: {
              lives: { type: 'integer' }
            }
          }
        }
      }
    };
    const generator = new KotlinGenerator({
      presets: [KOTLIN_JACKSON_PRESET],
      processorOptions: {
        asyncapi: {
          includeComponentSchemas: true
        },
        jsonSchema: {
          allowInheritance: true
        }
      }
    });

    const models = await generator.generate(document);
    const renderedModels = models
      .filter((model) => model.result)
      .map((model) => model.result.replace(/[ \t]+$/gm, ''));

    expect(renderedModels).toMatchSnapshot();
    expect(renderedModels).toContainEqual(
      expect.stringContaining('sealed interface Animals : Pet')
    );
    expect(renderedModels).toContainEqual(
      expect.stringMatching(/data class Dog[\s\S]*\) : Animals$/)
    );
    expect(renderedModels).not.toContainEqual(
      expect.stringMatching(/sealed interface Animals[\s\S]*@JsonTypeInfo/)
    );
  });
});
