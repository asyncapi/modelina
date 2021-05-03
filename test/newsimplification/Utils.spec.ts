
import { CommonModel } from '../../src/models/CommonModel';
import {addToTypes, inferTypeFromValue} from '../../src/newsimplification/Utils';

/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('utils', function() {
  beforeEach(() => {
    jest.clearAllMocks();
  })
  afterAll(() => {
    jest.restoreAllMocks();
  })
  describe('addToTypes', function() {
    test('should add type as is', function() {
      const model = new CommonModel(); 
      addToTypes('type', model);
      expect(model.type).toEqual('type');
    });
    test('should add type to existing type', function() {
      const model = new CommonModel(); 
      model.type = ['type1'];
      addToTypes('type2', model);
      expect(model.type).toEqual(['type1', 'type2']);
    });
    test('should set an array when adding two types', function() {
      const model = new CommonModel(); 
      addToTypes('type1', model);
      addToTypes('type2', model);
      expect(model.type).toEqual(['type1', 'type2']);
    });
  });
});