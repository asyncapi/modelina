/* eslint-disable no-undef */
import { CommonModel } from '../../src/models/CommonModel';
import { Simplifier } from '../../src/newsimplification/Simplifier';
import simplifyProperties from '../../src/newsimplification/SimplifyProperties';
const mockedSimplifierModel = new CommonModel();
jest.mock('../../src/newsimplification/Simplifier', () => {
  return {
    Simplifier: jest.fn().mockImplementation(() => {
      return {
        simplify: jest.fn().mockImplementation(() => { 
          return [mockedSimplifierModel]; 
        })
      };
    })
  };
});
jest.mock('../../src/models/CommonModel');
CommonModel.mergeCommonModels = jest.fn();
/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Simplification of properties', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should not do anything if schema does not contain properties', function() {
    const schema = {};
    const model = new CommonModel();
    const simplifier = new Simplifier();
    simplifyProperties(schema, model, simplifier);
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });
  test('should not do anything if schema is boolean', function() {
    const model = new CommonModel();
    const simplifier = new Simplifier();
    simplifyProperties(true, model, simplifier);
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });
  test('should infer type of model', () => {
    const schema: any = { properties: { 'property1': { type: 'string' } } };
    const model = new CommonModel();
    const simplifier = new Simplifier();
    simplifyProperties(schema, model, simplifier);
    expect(model.addTypes).toHaveBeenNthCalledWith(1, 'object');
  });
  test('should go trough properties and add it to model', () => {
    const schema: any = { properties: { 'property1': { type: 'string' } } };
    const model = new CommonModel();
    const simplifier = new Simplifier();
    simplifyProperties(schema, model, simplifier);
    expect(simplifier.simplify).toHaveBeenNthCalledWith(1, { type: 'string' });
    expect(model.addProperty).toHaveBeenNthCalledWith(1, "property1", mockedSimplifierModel, schema);
  });
});