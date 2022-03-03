import { JavaGenerator, JSONGenerator } from '../../../src/generators'; 

// describe('JSONGenerator', () => {
//   let generator: JSONGenerator;
//   beforeEach(() => {
//     generator = new JSONGenerator();
//   });
//   afterEach(() => {
//     jest.restoreAllMocks();
//   });

// }

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

const doc = {
  $id: 'TypeArray',
  type: 'array',
  items: {
    $id: 'StringArray',
    type: ['string', 'number', 'boolean'],
  }
};

const generator = new JSONGenerator();
generator.generate(doc).then((output) => {
  console.log(output);
});
