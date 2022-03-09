import { JSONGenerator } from '../../../src/generators/json/JSONGenerator';
import { CommonInputModel, CommonModel } from '../../../src/models';

describe('JSONGenerator', () => {
  let generator: JSONGenerator;
  beforeEach(() => {
    generator = new JSONGenerator();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Should render JSON schema for type object', async () => {
    const doc = {
      $id: 'Address',
      type: 'object',
      properties: {
        enum: { type: 'string' },
        reservedEnum: { type: 'string' }
      },
      additionalProperties: {
        type: 'string'
      },
      patternProperties: {
        '^S_': { type: 'string' },
        '^I_': { type: 'integer' }
      }
    };

    const inputModel = await generator.process(doc);
    const model = inputModel.models['Address'];
    const schema = await generator.render(model, inputModel);
    expect(schema.result).toMatchSnapshot();
    expect(schema.dependencies).toEqual([]);
  });

  test('Should render JSON schema for array object', async () => {
    const doc = {
      $id: 'TypeArray',
      type: 'array',
      items: {
        $id: 'StringArray',
        type: ['string', 'number', 'boolean'],
      }
    };

    const inputModel = await generator.process(doc);
    const model = inputModel.models['TypeArray'];
    const schema = await generator.render(model, inputModel);
    expect(schema.result).toMatchSnapshot();
    expect(schema.dependencies).toEqual([]);
  });
});

// const doc = {
//   $id: 'Address',
//   type: 'object',
//   properties: {
//     enum: { type: 'string' },
//     reservedEnum: { type: 'string' }
//   },
//   additionalProperties: {
//     type: 'string'
//   },
//   patternProperties: {
//     '^S_': { type: 'string' },
//     '^I_': { type: 'integer' }
//   }
// };

// const doc = {
//   $id: 'Address',
//   type: 'object',
//   properties: {
//     street_name: { type: 'string' },
//     city: { type: 'string', description: 'City description' },
//     state: { type: 'string' },
//     house_number: { type: 'number' },
//     marriage: { type: 'boolean', description: 'Status if marriage live in given house' },
//     members: { oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }], },
//     array_type: { type: 'array', items: [{ type: 'string' }, { type: 'number' }] },
//     other_model: { type: 'object', $id: 'OtherModel', properties: { street_name: { type: 'string' } } },
//   },
//   patternProperties: {
//     '^S(.?*)test&': {
//       type: 'string'
//     }
//   },
//   required: ['street_name', 'city', 'state', 'house_number', 'array_type'],
// };

// const doc = {
//   $id: 'TypeArray',
//   type: 'array',
//   items: {
//     $id: 'StringArray',
//     type: ['string', 'number', 'boolean'],
//   }
// };

// const generator = new JSONGenerator();
// generator.generate(doc).then((output) => {
//   console.log(output);
// })
