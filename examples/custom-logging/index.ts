import { TypeScriptGenerator, OutputModel, ModelLoggingInterface, Logger } from '../../src';

const doc = {
  $id: 'Address',
  type: 'object',
  properties: {
    street_name: { type: 'string' },
    city: { type: 'string', description: 'City description' },
    house_number: { type: 'number' },
    marriage: { type: 'boolean', description: 'Status if marriage live in given house' },
    pet_names: { type: 'array', items: { type: 'string' } },
    state: { type: 'string', enum: ['Texas', 'Alabama', 'California', 'other'] },
  },
  required: ['street_name', 'city', 'state', 'house_number', 'state'],
};

export async function generate(logger: ModelLoggingInterface) : Promise<OutputModel[]> {
  Logger.setLogger(logger);
  const generator = new TypeScriptGenerator({ modelType: 'interface' });
  return await generator.generate(doc);
}
