/* eslint-disable no-undef */
import { CommonModel } from '../../src/models/CommonModel';
import { Interpreter } from '../../src/interpreter/Interpreter';
import interpretPatternProperties from '../../src/interpreter/InterpretPatternProperties';

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

describe('Interpretation of patternProperties', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedReturnModels = [new CommonModel()];
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should not do anything if schema does not contain patternProperties', () => {
    const model = new CommonModel();
    const interpreter = new Interpreter();
    interpretPatternProperties({}, model, interpreter);
    expect(model.addPatternProperty).not.toHaveBeenCalled();
  });
  test('should not do anything if schema is boolean', () => {
    const model = new CommonModel();
    const interpreter = new Interpreter();
    interpretPatternProperties(true, model, interpreter);
    expect(model.addPatternProperty).not.toHaveBeenCalled();
  });

  test('should ignore model if interpreter cannot interpret patternProperties schema', () => {
    const schema: any = { patternProperties: { pattern: { type: 'string' } } };
    const model = new CommonModel();
    model.type = 'object';
    const interpreter = new Interpreter();
    mockedReturnModels.pop();
    interpretPatternProperties(schema, model, interpreter);
    expect(model.addPatternProperty).not.toHaveBeenCalled();
  });
  test('should use as is', () => {
    const schema: any = { patternProperties: { pattern: { type: 'string' } } };
    const model = new CommonModel();
    const interpreter = new Interpreter();
    interpretPatternProperties(schema, model, interpreter);
    expect(interpreter.interpret).toHaveBeenNthCalledWith(1, { type: 'string' }, Interpreter.defaultInterpreterOptions);
    expect(model.addPatternProperty).toHaveBeenNthCalledWith(1, 'pattern', mockedReturnModels[0], schema);
  });
});
