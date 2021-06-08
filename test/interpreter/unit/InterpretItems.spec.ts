/* eslint-disable no-undef */
import { CommonModel } from '../../../src/models/CommonModel';
import { Interpreter } from '../../../src/interpreter/Interpreter';
import interpretItems from '../../../src/interpreter/InterpretItems';
let mockedReturnModel: CommonModel | undefined = new CommonModel();
jest.mock('../../../src/interpreter/Interpreter', () => {
  return {
    Interpreter: jest.fn().mockImplementation(() => {
      return {
        interpret: jest.fn().mockImplementation(() => {return mockedReturnModel;})
      };
    })
  };
});
jest.mock('../../../src/models/CommonModel');
describe('Interpretation of', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedReturnModel = new CommonModel();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('should not do anything if schema does not contain items', () => {
    const schema = {};
    const model = new CommonModel();
    const interpreter = new Interpreter();
    interpretItems(schema, model, interpreter);
    expect(model.type).toBeUndefined();
    expect(model.addItem).not.toHaveBeenCalled();
  });

  test('should ignore model if interpreter cannot interpret item schema', () => {
    const schema: any = { items: { type: 'string' } };
    const model = new CommonModel();
    const interpreter = new Interpreter();
    mockedReturnModel = undefined;
    interpretItems(schema, model, interpreter);
    expect(model.type).toBeUndefined();
    expect(model.addItem).not.toHaveBeenCalled();
  });
  describe('single item schemas', () => {
    test('should set items', () => {
      const schema: any = { items: { type: 'string' } };
      const model = new CommonModel();
      const interpreter = new Interpreter();
      interpretItems(schema, model, interpreter);
      expect(interpreter.interpret).toHaveBeenNthCalledWith(1, { type: 'string' }, Interpreter.defaultInterpreterOptions);
      expect(model.addItem).toHaveBeenNthCalledWith(1, mockedReturnModel, schema);
    });
    test('should infer type of model', () => {
      const schema: any = { items: { type: 'string' } };
      const model = new CommonModel();
      const interpreter = new Interpreter();
      interpretItems(schema, model, interpreter);
      expect(model.addTypes).toHaveBeenNthCalledWith(1, 'array');
    });
  });
  describe('multiple item schemas', () => {
    test('should set items', () => {
      const schema: any = { items: [{ type: 'string' }, { type: 'number' }] };
      const model = new CommonModel();
      const interpreter = new Interpreter();
      interpretItems(schema, model, interpreter);
      expect(interpreter.interpret).toHaveBeenNthCalledWith(1, { type: 'string' }, Interpreter.defaultInterpreterOptions);
      expect(interpreter.interpret).toHaveBeenNthCalledWith(2, { type: 'number' }, Interpreter.defaultInterpreterOptions);
      expect(model.addItemTuple).toHaveBeenNthCalledWith(1, mockedReturnModel, schema, 0);
      expect(model.addItemTuple).toHaveBeenNthCalledWith(2, mockedReturnModel, schema, 1);
    });
    test('should infer type of model', () => {
      const schema: any = { items: [{ type: 'string' }, { type: 'number' }] };
      const model = new CommonModel();
      const interpreter = new Interpreter();
      interpretItems(schema, model, interpreter);
      expect(model.addTypes).toHaveBeenNthCalledWith(1, 'array');
    });
  });
});
