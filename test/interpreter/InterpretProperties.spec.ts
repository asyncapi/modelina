/* eslint-disable no-undef */
import { CommonModel } from '../../src/models/CommonModel';
import { Interpreter } from '../../src/interpreter/Interpreter';
import interpretProperties from '../../src/interpreter/InterpretProperties';
const mockedSimplifierModel = new CommonModel();
jest.mock('../../src/interpreter/Interpreter', () => {
  return {
    Interpreter: jest.fn().mockImplementation(() => {
      return {
        interpret: jest.fn().mockImplementation(() => { 
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
describe('Interpretation of properties', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should not do anything if schema does not contain properties', function() {
    const schema = {};
    const model = new CommonModel();
    const interpreter = new Interpreter();
    interpretProperties(schema, model, interpreter);
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });
  test('should not do anything if schema is boolean', function() {
    const model = new CommonModel();
    const interpreter = new Interpreter();
    interpretProperties(true, model, interpreter);
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });
  test('should infer type of model', () => {
    const schema: any = { properties: { 'property1': { type: 'string' } } };
    const model = new CommonModel();
    const interpreter = new Interpreter();
    interpretProperties(schema, model, interpreter);
    expect(model.addTypes).toHaveBeenNthCalledWith(1, 'object');
  });
  test('should go trough properties and add it to model', () => {
    const schema: any = { properties: { 'property1': { type: 'string' } } };
    const model = new CommonModel();
    const interpreter = new Interpreter();
    interpretProperties(schema, model, interpreter);
    expect(interpreter.interpret).toHaveBeenNthCalledWith(1, { type: 'string' });
    expect(model.addProperty).toHaveBeenNthCalledWith(1, "property1", mockedSimplifierModel, schema);
  });
});