/* eslint-disable no-undef */
import * as fs from 'fs';
import * as path from 'path';
import { CommonModel } from '../../src/models/CommonModel';
import { Interpreter } from '../../src/interpreter/Interpreter';
import interpretItems from '../../src/interpreter/InterpretItems';

jest.mock('../../src/interpreter/Interpreter', () => {
  return {
    Interpreter: jest.fn().mockImplementation(() => {
      return {
        interpret: jest.fn().mockReturnValue([new CommonModel()])
      };
    })
  };
});

jest.mock('../../src/models/CommonModel');
/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Simplification of', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  })
  test('should not do anything if schema does not contain items', function() {
    const model = new CommonModel();
    const interpreter = new Interpreter();
    interpretItems({}, model, interpreter);
  });
  test('should not do anything if schema is boolean', function() {
    const model = new CommonModel();
    const interpreter = new Interpreter();
    interpretItems(true, model, interpreter);
  });
  describe('single item schemas', () => {
    test('should set items', () => {
      const schema: any = { items: { type: 'string' } };
      const model = new CommonModel();
      const interpreter = new Interpreter();
      interpretItems(schema, model, interpreter);
      expect(interpreter.interpret).toHaveBeenNthCalledWith(1, { type: 'string' });
      expect(model).toMatchObject(
        {
          items: { },
        },
      );
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
      expect(model).toMatchObject(
        {
          items: {},
        },
      );
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