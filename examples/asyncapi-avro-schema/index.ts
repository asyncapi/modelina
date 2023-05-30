import { TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator();
const AsyncAPIDocument = {
  asyncapi: '2.6.0',
  info: {
    title: 'Example with Avro',
    version: '0.1.0'
  },
  channels: {
    example: {
      publish: {
        message: {
          schemaFormat: 'application/vnd.apache.avro;version=1.9.0',
          payload: {
            type: 'record',
            name: 'User',
            namespace: 'com.company',
            doc: 'User information',
            fields: [
              {
                name: 'displayName',
                type: 'string'
              },
              {
                name: 'email',
                type: 'string'
              },
              {
                name: 'age',
                type: 'int'
              }
            ]
          }
        }
      }
    }
  }
};

export async function generate(): Promise<void> {
  const models = await generator.generate(AsyncAPIDocument);
  for (const model of models) {
    console.log(model.result);
  }
}

if (require.main === module) {
  generate();
}
