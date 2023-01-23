import { JavaGenerator } from '../../../src/generators';

describe('JavaGenerator', () => {
  let generator: JavaGenerator;
  beforeEach(() => {
    generator = new JavaGenerator();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should not render reserved keyword', async () => {
    const doc = {
      $id: 'Address',
      type: 'object',
      properties: {
        enum: { type: 'string' },
        reservedEnum: { type: 'string' }
      },
      additionalProperties: false
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });
  test('should render `class` type', async () => {
    const doc = {
      $id: 'Address',
      type: 'object',
      properties: {
        street_name: { type: 'string' },
        city: { type: 'string', description: 'City description' },
        state: { type: 'string' },
        house_number: { type: 'number' },
        marriage: {
          type: 'boolean',
          description: 'Status if marriage live in given house'
        },
        members: {
          oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }]
        },
        array_type: {
          type: 'array',
          items: [{ type: 'string' }, { type: 'number' }]
        }
      },
      patternProperties: {
        '^S(.?*)test&': {
          type: 'string'
        }
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type']
    };
    const expectedDependencies = ['import java.util.Map;'];
    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual(expectedDependencies);
  });

  test('should work custom preset for `class` type', async () => {
    const doc = {
      $id: 'CustomClass',
      type: 'object',
      properties: {
        property: { type: 'string' }
      }
    };
    generator = new JavaGenerator({
      presets: [
        {
          class: {
            property({ renderer, property, content }) {
              const annotation = renderer.renderAnnotation(
                'JsonProperty',
                `"${property.propertyName}"`
              );
              return `${annotation}\n${content}`;
            },
            getter({ renderer, property, content }) {
              const annotation = renderer.renderAnnotation(
                'JsonProperty',
                `"${property.propertyName}"`
              );
              return `${annotation}\n${content}`;
            },
            setter({ renderer, property, content }) {
              const annotation = renderer.renderAnnotation(
                'JsonProperty',
                `"${property.propertyName}"`
              );
              return `${annotation}\n${content}`;
            }
          }
        }
      ]
    });
    const expectedDependencies = ['import java.util.Map;'];

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual(expectedDependencies);
  });

  test('should render `enum` type (string type)', async () => {
    const doc = {
      $id: 'States',
      type: 'string',
      enum: ['Texas', 'Alabama', 'California', 'New York']
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should render `enum` type (integer type)', async () => {
    const doc = {
      $id: 'Numbers',
      type: 'integer',
      enum: [0, 1, 2, 3]
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should render `enum` type (union type)', async () => {
    const doc = {
      $id: 'Union',
      type: ['string', 'integer', 'boolean'],
      enum: ['Texas', 'Alabama', 0, 1, '1', true, { test: 'test' }]
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should render custom preset for `enum` type', async () => {
    const doc = {
      $id: 'CustomEnum',
      type: 'string',
      enum: ['Texas', 'Alabama', 'California']
    };

    generator = new JavaGenerator({
      presets: [
        {
          enum: {
            self({ renderer, content }) {
              const annotation = renderer.renderAnnotation('EnumAnnotation');
              return `${annotation}\n${content}`;
            }
          }
        }
      ]
    });

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should render enums with translated special characters', async () => {
    const doc = {
      $id: 'States',
      enum: ['test+', 'test', 'test-', 'test?!', '*test']
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should render List type for collections', async () => {
    const doc = {
      $id: 'CustomClass',
      type: 'object',
      additionalProperties: false,
      properties: {
        arrayType: { type: 'array' }
      }
    };
    const expectedDependencies = ['import java.util.List;'];

    generator = new JavaGenerator({ collectionType: 'List' });

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual(expectedDependencies);
  });

  test('should render models and their dependencies', async () => {
    const doc = {
      $id: 'Address',
      type: 'object',
      properties: {
        street_name: { type: 'string' },
        city: { type: 'string', description: 'City description' },
        state: { type: 'string' },
        house_number: { type: 'number' },
        marriage: {
          type: 'boolean',
          description: 'Status if marriage live in given house'
        },
        members: {
          oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }]
        },
        array_type: {
          type: 'array',
          items: [{ type: 'string' }, { type: 'number' }]
        },
        other_model: {
          type: 'object',
          $id: 'OtherModel',
          properties: { street_name: { type: 'string' } }
        }
      },
      patternProperties: {
        '^S(.?*)test&': {
          type: 'string'
        }
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type']
    };
    const config = { packageName: 'test.packageName' };
    const models = await generator.generateCompleteModels(doc, config);
    expect(models).toHaveLength(2);
    expect(models[0].result).toMatchSnapshot();
    expect(models[1].result).toMatchSnapshot();
  });
  test('should throw error when reserved keyword is used in any part of the package name', async () => {
    const doc = {
      $id: 'Address',
      type: 'object',
      properties: {
        street_name: { type: 'string' },
        city: { type: 'string', description: 'City description' },
        state: { type: 'string' },
        house_number: { type: 'number' },
        marriage: {
          type: 'boolean',
          description: 'Status if marriage live in given house'
        },
        members: {
          oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }]
        },
        array_type: {
          type: 'array',
          items: [{ type: 'string' }, { type: 'number' }]
        }
      },
      patternProperties: {
        '^S(.?*)test&': {
          type: 'string'
        }
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type']
    };
    const config = { packageName: 'valid.package.correct.class' };
    const expectedError = new Error(
      "You cannot use 'valid.package.correct.class' as a package name, contains reserved keywords: [package, class]"
    );
    await expect(generator.generateCompleteModels(doc, config)).rejects.toEqual(
      expectedError
    );
  });
});
