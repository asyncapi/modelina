import { OutputModel, TypeScriptGenerator } from '../../../';

const playgroundAsyncAPIDocument = {
  asyncapi: '2.5.0',
  info: {
    title: 'Streetlights API',
    version: '1.0.0',
    description:
      'The Smartylighting Streetlights API allows you\nto remotely manage the city lights.\n',
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0'
    }
  },
  servers: {
    mosquitto: {
      url: 'mqtt://test.mosquitto.org',
      protocol: 'mqtt'
    }
  },
  channels: {
    'light/measured': {
      publish: {
        summary:
          'Inform about environmental lighting conditions for a particular streetlight.',
        operationId: 'onLightMeasured',
        message: {
          name: 'LightMeasured',
          payload: {
            type: 'object',
            $id: 'LightMeasured',
            properties: {
              id: {
                type: 'integer',
                minimum: 0,
                description: 'Id of the streetlight.'
              },
              lumens: {
                type: 'integer',
                minimum: 0,
                description: 'Light intensity measured in lumens.'
              },
              sentAt: {
                type: 'string',
                format: 'date-time',
                description: 'Date and time when the message was sent.'
              }
            }
          }
        }
      }
    },
    'turn/on': {
      subscribe: {
        summary:
          'Command a particular streetlight to turn the lights on or off.',
        operationId: 'turnOn',
        message: {
          name: 'TurnOn',
          payload: {
            type: 'object',
            $id: 'TurnOn',
            properties: {
              id: {
                type: 'integer',
                minimum: 0,
                description: 'Id of the streetlight.'
              },
              sentAt: {
                type: 'string',
                format: 'date-time',
                description: 'Date and time when the message was sent.'
              }
            }
          }
        }
      }
    }
  }
};

export function getGeneratedCode(): Promise<OutputModel[]> {
  const generator = new TypeScriptGenerator();
  const input = playgroundAsyncAPIDocument;
  return generator.generateCompleteModels(input, { exportType: 'named' });
}
