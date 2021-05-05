/* eslint-disable no-undef */
import { CommonModel } from '../../src/models/CommonModel';
import { Simplifier } from '../../src/newsimplification/Simplifier';
import simplifyPatternProperties from '../../src/newsimplification/SimplifyPatternProperties';

jest.mock('../../src/newsimplification/Simplifier', () => {
  return {
    Simplifier: jest.fn().mockImplementation(() => {
      return {
        simplify: jest.fn().mockReturnValue([new CommonModel()])
      };
    })
  };
});
CommonModel.mergeCommonModels = jest.fn();
/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Simplification of patternProperties', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('should use as is', () => {
    const schema: any = { patternProperties: { 'pattern': { type: 'string' } } };
    const model = new CommonModel();
    const simplifier = new Simplifier();
    simplifyPatternProperties(schema, model, simplifier);
    expect(simplifier.simplify).toHaveBeenNthCalledWith(1, { type: 'string' });
    expect(model).toMatchObject(
      {
        patternProperties: { 'pattern': {} },
      },
    );
  });
  test('should merge existing patterns', () => {
    const schema: any = { patternProperties: { 'pattern': { type: 'string' } } };
    const model = new CommonModel();
    model.patternProperties = { 'pattern': new CommonModel() };
    const simplifier = new Simplifier();
    simplifyPatternProperties(schema, model, simplifier);
    expect(simplifier.simplify).toHaveBeenNthCalledWith(1, { type: 'string' });
    expect(CommonModel.mergeCommonModels).toHaveBeenNthCalledWith(1, {  }, { }, schema);
    expect(model).toMatchObject(
      {
        patternProperties: { 'pattern': {} },
      },
    );
  });
});