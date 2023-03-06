import { CommonModel } from '../../../src/models/CommonModel';
import { Interpreter } from '../../../src/interpreter/Interpreter';
import InterpretIfThenElse from '../../../src/interpreter/InterpretIfThenElse';

describe('Interpretation of if/then/else', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should not do anything if schema does not contain if/then/else', () => {
    const model = new CommonModel();
    model.addItemUnion = jest.fn();
    const interpreter = new Interpreter();
    interpreter.interpret = jest.fn();

    InterpretIfThenElse({}, model, interpreter);

    expect(interpreter.interpret).not.toHaveBeenCalled();
    expect(model.addItemUnion).not.toHaveBeenCalled();
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });

  test('should handle required properties', () => {
    const model1 = new CommonModel();
    const model2 = new CommonModel();

    const eventSchema = {
      type: 'object',
      properties: {
        event_time: {
          type: 'string',
          format: 'date-time'
        }
      },
      required: ['event_time']
    };

    InterpretIfThenElse(
      {
        then: {
          ...eventSchema
        }
      },
      model1,
      new Interpreter(),
      {}
    );

    expect(model1.properties?.event_time).toBeDefined();
    expect(model1.required).toBe(undefined);

    InterpretIfThenElse(
      {
        else: {
          allOf: [
            {
              ...eventSchema
            }
          ]
        }
      },
      model2,
      new Interpreter(),
      {}
    );

    expect(model2.properties?.event_time).toBeDefined();
    expect(model2.required).toBe(undefined);
  });
});
