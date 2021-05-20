/* eslint-disable no-undef */
import { CommonModel } from '../../src/models/CommonModel';
import { Interpreter } from '../../src/interpreter/Interpreter';
import interpretItems from '../../src/interpreter/InterpretItems';
let mockedReturnModels = [new CommonModel()];
jest.mock('../../src/interpreter/Interpreter', () => {
  return {
    Interpreter: jest.fn().mockImplementation(() => {
      return {
        interpret: jest.fn().mockReturnValue(mockedReturnModels)
      };
    })
  };
});
jest.mock('../../src/models/CommonModel');
describe('Interpretation of', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedReturnModels = [new CommonModel()];
  });
  afterAll(() => {
    jest.restoreAllMocks();
  })
  test('should not do anything if schema does not contain items', function() {
    const schema = {};
    const model = new CommonModel();
    const interpreter = new Interpreter();
    interpretItems(schema, model, interpreter);
    expect(model.type).toBeUndefined();
    expect(model.addItem).not.toHaveBeenCalled();
  });

  test('should ignore model if interpreter cannot interpret property schema', () => {
    const schema: any = { items: { type: 'string' } };
    const model = new CommonModel();
    const interpreter = new Interpreter();
    mockedReturnModels.pop();
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
      expect(interpreter.interpret).toHaveBeenNthCalledWith(1, { type: 'string' });
      expect(model.addItem).toHaveBeenNthCalledWith(1, mockedReturnModels[0], schema);
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
      expect(interpreter.interpret).toHaveBeenNthCalledWith(1, { type: 'string' });
      expect(interpreter.interpret).toHaveBeenNthCalledWith(2, { type: 'number' });
      expect(model.addItem).toHaveBeenNthCalledWith(1, mockedReturnModels[0], schema);
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