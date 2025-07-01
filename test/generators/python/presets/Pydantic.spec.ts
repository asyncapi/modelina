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

  test('should render nullable union', async () => {
    const doc = {
      title: 'NullableUnionTest',
      type: 'object',
      required: ['nullableUnionTest'],
      properties: {
        nullableUnionTest: {
          anyOf: [
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
              type: 'null'
            }
          ]
        }
      }
    };

    const models = await generator.generate(doc);
    expect(models.map((model) => model.result)).toMatchSnapshot();
  });

  test('should render default value for discriminator when using polymorphism', async () => {
    const doc = {
      asyncapi: '3.0.0',
      info: {
        title: 'Vehicle Models',
        version: '1.0.0'
      },
      components: {
        messages: {
          Vehicle: {
            payload: {
              oneOf: [
                { $ref: '#/components/schemas/Car' },
                { $ref: '#/components/schemas/Truck' }
              ]
            }
          }
        },
        schemas: {
          Vehicle: {
            title: 'Vehicle',
            type: 'object',
            discriminator: 'vehicleType',
            properties: {
              vehicleType: {
                title: 'VehicleType',
                type: 'string'
              },
              length: {
                type: 'number',
                format: 'float'
              }
            },
            required: ['vehicleType']
          },
          Car: {
            allOf: [
              { $ref: '#/components/schemas/Vehicle' },
              {
                type: 'object',
                properties: {
                  vehicleType: {
                    const: 'Car'
                  }
                }
              }
            ]
          },
          Truck: {
            allOf: [
              { $ref: '#/components/schemas/Vehicle' },
              {
                type: 'object',
                properties: {
                  vehicleType: {
                    const: 'Truck'
                  }
                }
              }
            ]
          }
        }
      }
    };

    const models = await generator.generate(doc);
    expect(models.map((model) => model.result)).toMatchSnapshot();
  });

  test('should always set alias', async () => {
    const doc = {
      title: 'AliasTest',
      type: 'object',
      required: ['testAlias'],
      properties: {
        testAlias: {
          type: 'string'
        }
      }
    };

    const models = await generator.generate(doc);
    // check alias='aliasTest' is set - dunno what model.result yields, tho
    // in worst case check
    //expect(models.map((model) => model.result)).toContain("alias='''testAlias'''"); // why multi-line string?
    expect(models.map((model) => model.result)).toMatchSnapshot();
  });
});
