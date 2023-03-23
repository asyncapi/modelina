import { CommonModel } from '../../../src/models/CommonModel';
import { Interpreter } from '../../../src/interpreter/Interpreter';
import InterpretThenElse from '../../../src/interpreter/InterpretThenElse';

describe('Interpretation of then/else', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should not do anything if schema does not contain then/else', () => {
    const model = new CommonModel();
    model.addItemUnion = jest.fn();
    const interpreter = new Interpreter();
    interpreter.interpret = jest.fn();

    InterpretThenElse({}, model, interpreter);

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

    InterpretThenElse(
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

    InterpretThenElse(
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

  test('should handle recursive schemas', () => {
    const schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        condition: {
          type: 'string'
        },
        test: {
          properties: {
            test2: {
              type: 'string'
            }
          }
        }
      },
      if: {
        properties: {
          condition: {
            const: 'something'
          }
        }
      },
      then: {
        properties: {
          test: {
            required: ['test2']
          }
        }
      }
    };

    const model = new Interpreter().interpret(schema);

    expect(model?.properties?.test).toBeDefined();
    expect(model?.properties?.test.required).toBe(undefined);
  });
});
