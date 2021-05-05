/* eslint-disable no-undef */
import { CommonModel } from '../../src/models/CommonModel';
import { Simplifier } from '../../src/newsimplification/Simplifier';
import simplifyAdditionalProperties from '../../src/newsimplification/SimplifyAdditionalProperties';

jest.mock('../../src/newsimplification/Simplifier', () => {
  return {
    Simplifier: jest.fn().mockImplementation(() => {
      return {
        simplify: jest.fn().mockReturnValue([new CommonModel()])
      };
    })
  };
});

/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Simplification of additionalProperties', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('should use as is', () => {
    const schema: any = { additionalProperties: { type: 'string' } };
    const model = new CommonModel();
    const simplifier = new Simplifier();
    simplifyAdditionalProperties(schema, model, simplifier);
    expect(simplifier.simplify).toHaveBeenNthCalledWith(1, { type: 'string' });
    expect(model).toMatchObject(
      {
        additionalProperties: { },
      },
    );
  });
  test('should default to true', () => {
    const schema: any = { };
    const model = new CommonModel();
    const simplifier = new Simplifier();
    simplifyAdditionalProperties(schema, model, simplifier);
    expect(simplifier.simplify).toHaveBeenNthCalledWith(1, true);
    expect(model).toMatchObject(
      {
        additionalProperties: { },
      },
    );
  });
});