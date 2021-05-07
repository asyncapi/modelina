
import { CommonModel } from '../../src/models/CommonModel';
import { Simplifier } from '../../src/newsimplification/Simplifier';
import simplifyNot from '../../src/newsimplification/SimplifyNot';
import {inferTypeFromValue} from '../../src/newsimplification/Utils';
jest.mock('../../src/newsimplification/Utils');
/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Simplification of not', function() {
  beforeEach(() => {
    jest.clearAllMocks();
    (inferTypeFromValue as jest.Mock).mockImplementation(()=>{});
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should handle true schemas', function() {
    const schema: any = { not: true};
    const model = new CommonModel();
    simplifyNot(schema, model);
    expect(true).toEqual(false);
  });
  test('should handle false schemas', function() {
    const schema: any = { not: false};
    const model = new CommonModel();
    simplifyNot(schema, model);
    expect(true).toEqual(false);
  });
  describe('double negate', function() {

    test('should double negate enum', function() {
      const schema: any = { not: { enum: ["value"], not: { enum: ["value"] } }};
      const model = new CommonModel();
      model.enum = ["value"];
      simplifyNot(schema, model);
      expect(model.enum).toEqual(["value"]);
    });
  });
  describe('enums', function() {
    test('should handle negating only existing enum', function() {
      const schema: any = { not: { enum: ["value"] }};
      const model = new CommonModel();
      model.enum = ["value"];
      simplifyNot(schema, model);
      expect(model.enum).toBeUndefined();
    });
    test('should remove already existing inferred enums', function() {
      const schema: any = { not: { enum: ["value"] }};
      const model = new CommonModel();
      model.enum = ["value", "value2"];
      simplifyNot(schema, model);
      expect(model.enum).toEqual(["value2"]);
    });
    test('should not negating non existing enum', function() {
      const schema: any = { not: { enum: "value" }};
      const model = new CommonModel();
      model.enum = ["value2"];
      simplifyNot(schema, model);
      expect(model.enum).toEqual(["value2"]);
    });
    test('should handle multiple negated enums', function() {
      const schema: any = { not: { enum: ["value", "value2"] }};
      const model = new CommonModel();
      model.enum = ["value", "value2", "value3"];
      simplifyNot(schema, model);
      expect(model.enum).toEqual(["value3"]);
    });
  });
  describe('types', function() {
    test('should handle negating only existing type', function() {
      const schema: any = { not: { type: "string" }};
      const model = new CommonModel();
      model.type = "string";
      simplifyNot(schema, model);
      expect(true).toEqual(false);
    });
    test('should remove already existing inferred type', function() {
      const schema: any = { not: { type: "string" }};
      const model = new CommonModel();
      model.type = ["string", "number"];
      simplifyNot(schema, model);
      expect(model.type).toEqual("number");
    });
    test('should not negating non existing type', function() {
      const schema: any = { not: { type: "string" }};
      const model = new CommonModel();
      model.type = "number";
      simplifyNot(schema, model);
      expect(model.type).toEqual("number");
    });
    test('should handle multiple negated types', function() {
      const schema: any = { not: { type: ["string", "number"] }};
      const model = new CommonModel();
      model.type = ["number", "string", "integer"];
      simplifyNot(schema, model);
      expect(model.type).toEqual("integer");
    });
  });
});