/* eslint-disable no-undef */
import * as fs from 'fs';
import * as path from 'path';
import { CommonModel } from '../../src/models/CommonModel';
import { Simplifier } from '../../src/newsimplification/Simplifier';
import simplifyItems from '../../src/newsimplification/SimplifyItems';

jest.mock('../../src/newsimplification/Simplifier', () => {
  return {
    Simplifier: jest.fn().mockImplementation(() => {
      return {
        simplify: jest.fn().mockReturnValue([new CommonModel()])
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
    const simplifier = new Simplifier();
    simplifyItems({}, model, simplifier);
  });
  test('should not do anything if schema is boolean', function() {
    const model = new CommonModel();
    const simplifier = new Simplifier();
    simplifyItems(true, model, simplifier);
  });
  describe('single item schemas', () => {
    test('should set items', () => {
      const schema: any = { items: { type: 'string' } };
      const model = new CommonModel();
      const simplifier = new Simplifier();
      simplifyItems(schema, model, simplifier);
      expect(simplifier.simplify).toHaveBeenNthCalledWith(1, { type: 'string' });
      expect(model).toMatchObject(
        {
          items: { },
        },
      );
    });
    test('should infer type of model', () => {
      const schema: any = { items: { type: 'string' } };
      const model = new CommonModel();
      const simplifier = new Simplifier();
      simplifyItems(schema, model, simplifier);
      expect(model.addToTypes).toHaveBeenNthCalledWith(1, 'array');
    });
  });
  describe('multiple item schemas', () => {
    test('should set items', () => {
      const schema: any = { items: [{ type: 'string' }, { type: 'number' }] };
      const model = new CommonModel();
      const simplifier = new Simplifier();
      simplifyItems(schema, model, simplifier);
      expect(simplifier.simplify).toHaveBeenNthCalledWith(1, { type: 'string' });
      expect(simplifier.simplify).toHaveBeenNthCalledWith(2, { type: 'number' });
      expect(model).toMatchObject(
        {
          items: {},
        },
      );
    });
    test('should infer type of model', () => {
      const schema: any = { items: [{ type: 'string' }, { type: 'number' }] };
      const model = new CommonModel();
      const simplifier = new Simplifier();
      simplifyItems(schema, model, simplifier);
      expect(model.addToTypes).toHaveBeenNthCalledWith(1, 'array');
    });
  });
});