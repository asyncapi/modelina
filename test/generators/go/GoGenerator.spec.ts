import { GoGenerator } from '../../../src/generators';

describe('GoGenerator', () => {
  let generator: GoGenerator;
  beforeEach(() => {
    generator = new GoGenerator();
  });
  test('should render `struct` type', async () => {
    const doc = {
      $id: '_address',
      type: 'object',
      properties: {
        street_name: { type: 'string' },
        city: { type: 'string', description: 'City description' },
        state: { type: 'string' },
        house_number: { type: 'number' },
        marriage: { type: 'boolean', description: 'Status if marriage live in given house' },
        members: { oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }], },
        tuple_type: { type: 'array', items: [{ type: 'string' }, { type: 'number' }] },
        array_type: { type: 'array', items: { type: 'string' } },
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type'],
    };
    const expected = `// Address represents a Address model.
type Address struct {
  StreetName string
  City string
  State string
  HouseNumber int
  Marriage bool
  Members []interface{}
  TupleType []interface{}
  ArrayType []string
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models['_address'];

    let classModel = await generator.renderStruct(model, inputModel);
    expect(classModel.result).toEqual(expected);
    expect(classModel.dependencies).toEqual([]);

    classModel = await generator.render(model, inputModel);
    expect(classModel.result).toEqual(expected);
    expect(classModel.dependencies).toEqual([]);
  });
});
