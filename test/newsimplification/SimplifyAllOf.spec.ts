/* eslint-disable no-undef */
import { CommonModel } from '../../src/models/CommonModel';
import { Simplifier } from '../../src/newsimplification/Simplifier';
import { isModelObject } from '../../src/newsimplification/Utils';
import simplifyAllOf from '../../src/newsimplification/SimplifyAllOf';
import { SimplificationOptions } from '../../src/models/SimplificationOptions';

let simplifierOptions: SimplificationOptions = {};
let simplifiedModel = new CommonModel();
jest.mock('../../src/newsimplification/Simplifier', () => {
  return {
    Simplifier: jest.fn().mockImplementation(() => {
      return {
        simplify: jest.fn().mockImplementation(() => {return [simplifiedModel]}),
        combineSchemas: jest.fn(),
        options: simplifierOptions
      };
    })
  };
});
jest.mock('../../src/models/CommonModel');
let mockedIsModelObjectReturn = false;
jest.mock('../../src/newsimplification/Utils', () => {
  return {
    isModelObject: jest.fn().mockImplementation(() => {
      return mockedIsModelObjectReturn;
    })
  }
});
CommonModel.mergeCommonModels = jest.fn();
/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Simplification of allOf', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    simplifierOptions = {allowInheritance: true};
    simplifiedModel = new CommonModel();
    mockedIsModelObjectReturn = false;
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should not do anything if schema does not contain allOf', function() {
    const model = new CommonModel();
    const simplifier = new Simplifier();
    simplifyAllOf({}, model, simplifier);
    expect(simplifier.combineSchemas).not.toHaveBeenCalled();
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });

  test('should combine schemas if inheritance is disabled', function() {
    const model = new CommonModel();
    const schema = { allOf: [{}] };
    simplifierOptions.allowInheritance = false;
    const simplifier = new Simplifier(simplifierOptions);
    simplifyAllOf(schema, model, simplifier);
    expect(simplifier.combineSchemas).toHaveBeenNthCalledWith(1, schema.allOf[0], model, schema);
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });

  test('should handle empty allOf array', function() {
    const model = new CommonModel();
    const schema = { allOf: [] };
    const simplifier = new Simplifier(simplifierOptions);
    simplifyAllOf(schema, model, simplifier);
    expect(simplifier.combineSchemas).not.toHaveBeenCalled();
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });
  test('should extend all of model object', function() {
    const model = new CommonModel();
    const schema = { allOf: [{type: "object", $id: "test"}] };
    simplifiedModel.$id = "test";
    mockedIsModelObjectReturn = true;
    const simplifier = new Simplifier(simplifierOptions);
    simplifyAllOf(schema, model, simplifier);
    expect(simplifier.combineSchemas).not.toHaveBeenCalled();
    expect(model.extend).toEqual(['test']);
  });
});