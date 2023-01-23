/* eslint-disable no-undef */
import { CommonModel } from '../../../src/models/CommonModel';
import { Interpreter } from '../../../src/interpreter/Interpreter';
import interpretPatternProperties from '../../../src/interpreter/InterpretPatternProperties';

jest.mock('../../../src/interpreter/Interpreter');
jest.mock('../../../src/models/CommonModel');

describe('Interpretation of patternProperties', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should not do anything if schema does not contain patternProperties', () => {
    const model = new CommonModel();
    const interpreter = new Interpreter();
    const mockedReturnModel = new CommonModel();
    (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

    interpretPatternProperties({}, model, interpreter);

    expect(model.addPatternProperty).not.toHaveBeenCalled();
  });
  test('should not do anything if schema is boolean', () => {
    const model = new CommonModel();
    const interpreter = new Interpreter();
    const mockedReturnModel = new CommonModel();
    (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

    interpretPatternProperties(true, model, interpreter);

    expect(model.addPatternProperty).not.toHaveBeenCalled();
  });

  test('should ignore model if interpreter cannot interpret patternProperties schema', () => {
    const schema: any = { patternProperties: { pattern: { type: 'string' } } };
    const model = new CommonModel();
    model.type = 'object';
    const interpreter = new Interpreter();
    (interpreter.interpret as jest.Mock).mockReturnValue(undefined);

    interpretPatternProperties(schema, model, interpreter);

    expect(model.addPatternProperty).not.toHaveBeenCalled();
  });
  test('should use as is', () => {
    const schema: any = { patternProperties: { pattern: { type: 'string' } } };
    const model = new CommonModel();
    const interpreter = new Interpreter();
    const mockedReturnModel = new CommonModel();
    (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

    interpretPatternProperties(schema, model, interpreter);

    expect(interpreter.interpret).toHaveBeenNthCalledWith(
      1,
      { type: 'string' },
      Interpreter.defaultInterpreterOptions
    );
    expect(model.addPatternProperty).toHaveBeenNthCalledWith(
      1,
      'pattern',
      mockedReturnModel,
      schema
    );
  });
});
