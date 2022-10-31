import { PythonGenerator } from '../../src';
import { PythonOptions } from '../../src/generators/python/PythonGenerator';
import { DeepPartial } from '../../src/utils';

let generator: PythonGenerator;
export const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    email: {
      type: 'string',
      format: 'email'
    },
    objProperty: {
      type: 'object',
      properties: {
        number: {
          type: 'number'
        }
      }
    }
  }
};

export async function generate(options: DeepPartial<PythonOptions>) : Promise<void> {
  generator = new PythonGenerator(options);
  const models = await generator.generateCompleteModels(jsonSchemaDraft7, options);
  for (const model of models) {
    console.log(model.result);
  }
}

// if (require.main === module) {
//   generator = new PythonGenerator(PythonGenerator.defaultOptions);
//   generate({});
// }
