/* eslint-disable no-undef */
import { CommonModel } from '../../../src/models/CommonModel';
import { Interpreter } from '../../../src/interpreter/Interpreter';
import interpretDependencies from '../../../src/interpreter/InterpretDependencies';
jest.mock('../../../src/interpreter/Interpreter');
jest.mock('../../../src/models/CommonModel');
jest.mock('../../../src/interpreter/Utils');
/**
 * Some of these test are purely theoretical and have little if any merit
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Interpretation of dependencies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should not do anything if schema does not contain dependencies', () => {
    const model = new CommonModel();
    const interpreter = new Interpreter();

    interpretDependencies({}, model, interpreter);

    expect(interpreter.interpretAndCombineSchema).not.toHaveBeenCalled();
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });
  test('should not do anything with property dependencies', () => {
    const model = new CommonModel();
    const interpreter = new Interpreter();
    const schema = { dependencies: { dep1: ['dep2'] } };

    interpretDependencies(schema, model, interpreter);

    expect(interpreter.interpretAndCombineSchema).not.toHaveBeenCalled();
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });

  test('should interpret and combine schema dependencies', () => {
    const model = new CommonModel();
    const schema = { dependencies: { dep1: {} } };
    const interpreter = new Interpreter();

    interpretDependencies(schema, model, interpreter);

    expect(interpreter.interpretAndCombineSchema).toHaveBeenNthCalledWith(
      1,
      schema.dependencies.dep1,
      model,
      schema,
      Interpreter.defaultInterpreterOptions
    );
  });
});
