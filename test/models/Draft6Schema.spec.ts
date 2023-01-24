import { Draft6Schema } from '../../src/models';

describe('Draft6Schema', () => {
  describe('toSchema', () => {
    test('should throw error when trying to convert non-object', () => {
      const expectedError =
        'Could not convert input to expected copy of Draft6Schema';
      expect(() => {
        Draft6Schema.toSchema(1 as any);
      }).toThrow(expectedError);
    });
    test('should handle recursive schemas', () => {
      const recursiveDoc = { type: 'object', properties: {} };
      const doc = { type: 'object', properties: { test: recursiveDoc } };
      (recursiveDoc.properties as any)['test'] = doc;
      const d = Draft6Schema.toSchema(doc) as Draft6Schema;
      expect(typeof d).toEqual('object');
      const d2 = Draft6Schema.toSchema(d as any) as Draft6Schema;
      expect(typeof d2).toEqual('object');
    });
    test('should never return the same instance of properties', () => {
      const doc = { type: 'string', properties: { test: { type: 'string' } } };
      const d = Draft6Schema.toSchema(doc) as Draft6Schema;
      expect(typeof d).toEqual('object');
      const d2 = Draft6Schema.toSchema(d as any) as Draft6Schema;
      expect(typeof d2).toEqual('object');
      (d.properties!['test'] as Draft6Schema).$id = 'test';
      expect((d.properties!['test'] as Draft6Schema).$id).toEqual('test');
      expect((d2.properties!['test'] as Draft6Schema).$id).not.toEqual('test');
    });
    test('should never return the same instance of items', () => {
      const doc = { type: 'string', items: [{ type: 'string' }] };
      const d = Draft6Schema.toSchema(doc) as Draft6Schema;
      expect(typeof d).toEqual('object');
      const d2 = Draft6Schema.toSchema(d as any) as Draft6Schema;
      expect(typeof d2).toEqual('object');
      const d_items: Draft6Schema[] = d.items as Draft6Schema[];
      const d2_items: Draft6Schema[] = d2.items as Draft6Schema[];
      d_items[0].$id = 'test';
      expect(d_items[0].$id).toEqual('test');
      expect(d2_items[0].$id).not.toEqual('test');
    });
    test('should never convert value properties', () => {
      const doc = { enum: [{ test: { type: 'string' } }] };
      const d = Draft6Schema.toSchema(doc) as Draft6Schema;
      expect(typeof d).toEqual('object');
      expect(d.enum![0] instanceof Draft6Schema).toEqual(false);
    });
  });
});
