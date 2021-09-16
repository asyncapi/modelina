import { TypeScriptGenerator, ModelLoggingInterface, Logger } from '@asyncapi/modelina';

const generator = new TypeScriptGenerator({ modelType: 'interface' });
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    email: {
      type: 'string',
      format: 'email'
    }
  }
};
const customLogger: ModelLoggingInterface = {
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error
};
Logger.setLogger(customLogger);

export async function generate(logCallback : (msg: string) => void): Promise<void> {
  const models = await generator.generate(jsonSchemaDraft7);
  for (const model of models) {
    logCallback(model.result);
  }
}

generate(console.log);
