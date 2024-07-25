import { CommonModel } from '../../src';
import { Interpreter } from '../../src/interpreter/Interpreter';

describe('Interpreter', () => {
  test('should return multiple separate models', () => {
    const schema = {
      $id: 'schema1',
      properties: {
        testProp: {
          $id: 'schema2',
          type: 'object'
        }
      }
    };
    const interpreter = new Interpreter();
    const interpretedModel = interpreter.interpret(schema);
    expect(interpretedModel).toMatchSnapshot();
  });
});
