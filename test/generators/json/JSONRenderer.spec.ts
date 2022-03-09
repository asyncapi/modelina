import { JSONGenerator } from '../../../src/generators';
import { JSONRenderer } from '../../../src/generators/json/JSONRenderer';
import { CommonInputModel, CommonModel } from '../../../src/models';

class MockJSONRenderer extends JSONRenderer {

}

describe('JSONRenderer', () => {
  let renderer: JSONRenderer;
  beforeEach(() => {
    renderer = new MockJSONRenderer(JSONGenerator.defaultOptions, new JSONGenerator(), [], new CommonModel(), new CommonInputModel());
  });

  describe('nameType()', () => {
    test('should name the type', () => {
      const name = renderer.nameType('type__someType');
      expect(name).toEqual('TypeSomeType');
    });
  });
  
  describe('nameProperty()', () => {
    test('should name the property', () => {
      const name = renderer.nameProperty('property__someProperty');
      expect(name).toEqual('propertySomeProperty');
    });
  });

  describe('renderType()', () => {
    test('Should render refs with pascal case', () => {
      const model = new CommonModel();
      model.$ref = '<anonymous-schema-1>';
      expect(renderer.renderType(model)).toEqual('AnonymousSchema_1');
    });
    test('Should render array of CommonModels if no type is mentioned', () => {
      const model1 = new CommonModel();
      model1.$ref = 'ref1';
      const model2 = new CommonModel();
      model2.$ref = 'ref2';
      expect(renderer.renderType([model1, model2])).toEqual(['Ref1','Ref2']);
    });
    test('Should render enums', () => {
      const model = new CommonModel();
      model.enum = ['enum1', 'enum2', 9];
      expect(renderer.renderType(model)).toEqual(['enum1','enum2', 9]);
    });
    test('should render arrays if type is mentioned', () => {
      const model = new CommonModel();
      model.type = ['integer', 'number'];
      expect(renderer.renderType(model)).toEqual('array');
    });
  });

  describe('renderArrayItems()', () => {
    test('Should render items and additionalItems of type array', () => {
      const doc = {
        $id: 'TypeArray',
        type: 'array',
        items: {
          $id: 'StringArray',
          type: ['string', 'number', 'boolean'],
        }
      };
      const model = CommonModel.toCommonModel(doc);
      expect(renderer.renderArrayItems(model)).toMatchSnapshot();
    });
  });

  describe('renderObject()', () => {
    test('Should render JSON Schema of type object', () => {
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
      const model = CommonModel.toCommonModel(doc);
      expect(renderer.renderObject(model)).toMatchSnapshot();
    });
  });

  describe('renderAllProperties()', () => {
    test('Should render all properties of the model', () => {
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
      const model = CommonModel.toCommonModel(doc);
      expect(renderer.renderAllProperties(model)).toMatchSnapshot();
    });

    test('Shouldn\'t render the missing properties.', () => {
      const doc = {
        $id: 'Address',
        type: 'object',
        properties: {
          enum: { type: 'string' },
          reservedEnum: { type: 'string' }
        },
        additionalProperties: {
          type: 'string'
        }
      };
      const model = CommonModel.toCommonModel(doc);
      const result = renderer.renderAllProperties(model);
      expect(result).toMatchSnapshot();
      expect(result.patternProperties).toBeUndefined();
    });
  });
});

