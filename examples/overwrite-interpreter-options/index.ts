import { TypeScriptGenerator } from '../../src';
import { CommonModel } from '../../src';
import {
  InterpreterSchemaType,
  Interpreter,
  InterpreterOptions
} from '../../src/interpreter/Interpreter';
import { isModelObject } from '../../src/interpreter/Utils';

const generator = new TypeScriptGenerator({
  processorOptions: {
    interpreter: {
      additionalProperties: (
        schema: InterpreterSchemaType,
        model: CommonModel,
        interpreter: Interpreter,
        options?: InterpreterOptions
      ) => {
        if (typeof schema === 'boolean' || isModelObject(model) === false) {
          return;
        }

        // Here we ensure that if additionalProperties are missing
        // then schema schema.additionalProperties will set to false
        const additionalPropertiesModel = interpreter.interpret(
          schema.additionalProperties === undefined
            ? false
            : schema.additionalProperties,
          options
        );
        if (additionalPropertiesModel !== undefined) {
          model.addAdditionalProperty(additionalPropertiesModel, schema);
        }
      }
    }
  }
});

const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email'
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
