import { CommonModel } from '../../src';
import { Interpreter } from '../../src/interpreter/Interpreter';

describe('Integration test for interpreter', () => {
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
    const models = interpreter.interpret(schema);
    expect(models).toHaveLength(2);
    const expectedSchema1Model = new CommonModel();
    expectedSchema1Model.$id = 'schema1';
    const expectedPropertyModel = new CommonModel();
    expectedPropertyModel.$ref = 'schema2';
    expectedSchema1Model.properties = {
      testProp: expectedPropertyModel
    };
    const expectedSchema2Model = new CommonModel();
    expectedSchema2Model.$id = 'schema2';
    expect(models[0]).toMatchObject(expectedSchema1Model);
    expect(models[1]).toMatchObject(expectedSchema2Model);
  });
});
