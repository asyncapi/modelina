import {
  PythonGenerator,
  PYTHON_PYDANTIC_PRESET
} from '../../../../src/generators/python';

describe('PYTHON_PYDANTIC_PRESET', () => {
  let generator: PythonGenerator;

  beforeEach(() => {
    generator = new PythonGenerator({
      presets: [PYTHON_PYDANTIC_PRESET]
    });
  });

  test('should render pydantic for class', async () => {
    const doc = {
      title: 'Test',
      type: 'object',
      properties: {
        prop: {
          description: `test
  multi
  line
  description`,
          type: 'string'
        }
      }
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });

  test('should render union to support Python < 3.10', async () => {
    const doc = {
      title: 'UnionTest',
      type: 'object',
      properties: {
        unionTest: {
          oneOf: [
            {
              title: 'Union1',
              type: 'object',
              properties: {
                testProp1: {
                  type: 'string'
                }
              }
            },
            {
              title: 'Union2',
              type: 'object',
              properties: {
                testProp2: {
                  type: 'string'
                }
              }
            }
          ]
        }
      }
    };

    const models = await generator.generate(doc);
    expect(models.map((model) => model.result)).toMatchSnapshot();
  });
});
