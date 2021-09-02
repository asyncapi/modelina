import { TypeScriptGenerator } from '../../src';

test('Readme example (./README.md)', async () => {
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
  const expectedAddressInterface = `export interface Address {
  streetName: string;
  city: string;
  houseNumber: number;
  marriage?: boolean;
  petNames?: Array<string>;
  state: State;
  additionalProperties?: Map<String, object | string | number | Array<unknown> | boolean | null | number>;
}`;
  const expectedState = `export enum State {
  TEXAS = "Texas",
  ALABAMA = "Alabama",
  CALIFORNIA = "California",
  OTHER = "other",
}`;
  const generator = new TypeScriptGenerator({ modelType: 'interface' });
  const models = await generator.generate(doc);
  expect(models[0].result).toEqual(expectedAddressInterface); 
  expect(models[1].result).toEqual(expectedState); 
});
