
import { CommonModel } from '../../src/models/CommonModel';
import { Interpreter } from '../../src/interpreter/Interpreter';
import interpretNot from '../../src/interpreter/InterpretNot';
import {inferTypeFromValue} from '../../src/interpreter/Utils';
import { Logger } from '../../src/utils';
jest.mock('../../src/interpreter/Utils');
jest.mock('../../src/utils');

describe('Interpretation of not', function() {
  beforeEach(() => {
    jest.clearAllMocks();
    (inferTypeFromValue as jest.Mock).mockImplementation(()=>{});
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should not do anything if not is not defined', function() {
    const schema: any = {};
    const model = new CommonModel();
    const interpreter = new Interpreter();
    interpretNot(schema, model, interpreter);
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });
  test('should warn about true schemas', function() {
    const schema: any = { not: true};
    const model = new CommonModel();
    model.type = ["string"];
    const interpreter = new Interpreter();
    interpretNot(schema, model, interpreter);
    expect(Logger.warn).toHaveBeenCalled();
  });
  test('should handle false schemas', function() {
    const schema: any = { not: false};
    const model = new CommonModel();
    const interpreter = new Interpreter();
    interpretNot(schema, model, interpreter);
  });
  describe('double negate', function() {

    test('should double negate enum', function() {
      const schema: any = { not: { enum: ["value"], not: { enum: ["value"] } }};
      const model = new CommonModel();
      const interpreter = new Interpreter();
      interpretNot(schema, model, interpreter);
      expect(model.enum).toEqual(["value"]);
    });

    test('should double negate types', function() {
      const schema: any = { not: { type: "string", not: { type: "string" }}};
      const model = new CommonModel();
      const interpreter = new Interpreter();
      interpretNot(schema, model, interpreter);
      expect(model.type).toEqual("string");
    });
  });
  describe('enums', function() {
    test('should handle negating only existing enum', function() {
      const schema: any = { not: { enum: ["value"] }};
      const model = new CommonModel();
      model.enum = ["value"];
      const interpreter = new Interpreter();
      interpretNot(schema, model, interpreter);
      expect(model.enum).toBeUndefined();
    });
    test('should remove already existing inferred enums', function() {
      const schema: any = { not: { enum: ["value"] }};
      const model = new CommonModel();
      model.enum = ["value", "value2"];
      const interpreter = new Interpreter();
      interpretNot(schema, model, interpreter);
      expect(model.enum).toEqual(["value2"]);
    });
    test('should not negating non existing enum', function() {
      const schema: any = { not: { enum: ["value"] }};
      const model = new CommonModel();
      model.enum = ["value2"];
      const interpreter = new Interpreter();
      interpretNot(schema, model, interpreter);
      expect(model.enum).toEqual(["value2"]);
    });
    test('should handle multiple negated enums', function() {
      const schema: any = { not: { enum: ["value", "value2"] }};
      const model = new CommonModel();
      model.enum = ["value", "value2", "value3"];
      const interpreter = new Interpreter();
      interpretNot(schema, model, interpreter);
      expect(model.enum).toEqual(["value3"]);
    });
  });
  describe('types', function() {
    test('should handle negating only existing type', function() {
      const schema: any = { not: { type: "string" }};
      const model = new CommonModel();
      model.type = "string";
      const interpreter = new Interpreter();
      interpretNot(schema, model, interpreter);
      expect(model.type).toBeUndefined();
    });
    test('should remove already existing inferred type', function() {
      const schema: any = { not: { type: "string" }};
      const model = new CommonModel();
      model.type = ["string", "number"];
      const interpreter = new Interpreter();
      interpretNot(schema, model, interpreter);
      expect(model.type).toEqual("number");
    });
    test('should not negating non existing type', function() {
      const schema: any = { not: { type: "string" }};
      const model = new CommonModel();
      model.type = "number";
      const interpreter = new Interpreter();
      interpretNot(schema, model, interpreter);
      expect(model.type).toEqual("number");
    });
    test('should handle multiple negated types', function() {
      const schema: any = { not: { type: ["string", "number"] }};
      const model = new CommonModel();
      model.type = ["number", "string", "integer"];
      const interpreter = new Interpreter();
      interpretNot(schema, model, interpreter);
      expect(model.type).toEqual("integer");
    });
  });
});