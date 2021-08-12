import { CSharpGenerator } from '../../../src/generators';

describe('CSharpGenerator', () => {
  let generator: CSharpGenerator;
  beforeEach(() => {
    generator = new CSharpGenerator();
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

    const inputModel = await generator.process(doc);
    const model = inputModel.models['Address'];

    let classModel = await generator.renderClass(model, inputModel);
    expect(classModel.result).toMatchSnapshot();

    classModel = await generator.render(model, inputModel);
    expect(classModel.result).toMatchSnapshot();
  });
  test('should render `class` type', async () => {
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
      additionalProperties: {
        type: 'string'
      },
      patternProperties: {
        '^S(.?*)test&': {
          type: 'string'
        }
      },
    };

    const inputModel = await generator.process(doc);
    const model = inputModel.models['_address'];

    let classModel = await generator.renderClass(model, inputModel);
    expect(classModel.result).toMatchSnapshot();
    expect(classModel.dependencies).toEqual(['using System.Collections.Generic;']);

    classModel = await generator.renderClass(model, inputModel);
    expect(classModel.result).toMatchSnapshot();
    expect(classModel.dependencies).toEqual(['using System.Collections.Generic;']);
  });

  test('should work custom preset for `class` type', async () => {
    const doc = {
      $id: 'CustomClass',
      type: 'object',
      properties: {
        property: { type: 'string' },
      },
      additionalProperties: {
        type: 'string'
      }
    };

    generator = new CSharpGenerator({ presets: [
      {
        class: {
          property({ propertyName, property, renderer }) {
            return `private ${propertyName} ${renderer.renderType(property)}`;
          },
        }
      }
    ] });

    const inputModel = await generator.process(doc);
    const model = inputModel.models['CustomClass'];
    
    const classModel = await generator.render(model, inputModel);
    expect(classModel.result).toMatchSnapshot();
    expect(classModel.dependencies).toEqual(['using System.Collections.Generic;']);
  });

  describe.each([
    {
      name: 'with enums sharing same type',
      doc: {
        $id: 'States',
        type: 'string',
        enum: ['Texas', 'Alabama', 'California'],
      }
    },
    {
      name: 'with enums of mixed types',
      doc: {
        $id: 'Things',
        enum: ['Texas', 1, false],
      }
    },
  ])('should render `enum` type $name', ({doc}) => {
    test('should not be empty', async () => {
      const inputModel = await generator.process(doc);
      const model = inputModel.models[doc.$id];

      let enumModel = await generator.render(model, inputModel);
      expect(enumModel.result).toMatchSnapshot();
      expect(enumModel.dependencies).toEqual([]);
        
      enumModel = await generator.renderEnum(model, inputModel);
      expect(enumModel.result).toMatchSnapshot();
      expect(enumModel.dependencies).toEqual([]);
    });
  });

  test('should work custom preset for `enum` type', async () => {
    const doc = {
      $id: 'CustomEnum',
      type: 'string',
      enum: ['Texas', 'Alabama', 'California'],
    };

    generator = new CSharpGenerator({ presets: [
      {
        enum: {
          self({ content }) {
            return content;
          },
        }
      }
    ] });

    const inputModel = await generator.process(doc);
    const model = inputModel.models['CustomEnum'];
    
    let enumModel = await generator.render(model, inputModel);
    expect(enumModel.result).toMatchSnapshot();
    expect(enumModel.dependencies).toEqual([]);
    
    enumModel = await generator.renderEnum(model, inputModel);
    expect(enumModel.result).toMatchSnapshot();
    expect(enumModel.dependencies).toEqual([]);
  });
});
