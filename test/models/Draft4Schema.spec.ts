import { Draft4Schema } from '../../src/models';

describe('Draft4Schema', () => {
  describe('toSchema', () => {
    test('should throw error when trying to convert non-object', () => {
      const expectedError =
        'Could not convert input to expected copy of Draft4Schema';
      expect(() => {
        Draft4Schema.toSchema(1 as any);
      }).toThrow(expectedError);
    });
    test('should handle recursive schemas', () => {
      const recursiveDoc = { type: 'object', properties: {} };
      const doc = { type: 'object', properties: { test: recursiveDoc } };
      (recursiveDoc.properties as any)['test'] = doc;
      const d = Draft4Schema.toSchema(doc) as Draft4Schema;
      expect(typeof d).toEqual('object');
      const d2 = Draft4Schema.toSchema(d as any) as Draft4Schema;
      expect(typeof d2).toEqual('object');
    });
    test('should never return the same instance of properties', () => {
      const doc = { type: 'string', properties: { test: { type: 'string' } } };
      const d = Draft4Schema.toSchema(doc) as Draft4Schema;
      expect(typeof d).toEqual('object');
      const d2 = Draft4Schema.toSchema(d as any) as Draft4Schema;
      expect(typeof d2).toEqual('object');
      (d.properties!['test'] as Draft4Schema).id = 'test';
      expect((d.properties!['test'] as Draft4Schema).id).toEqual('test');
      expect((d2.properties!['test'] as Draft4Schema).id).not.toEqual('test');
    });
    test('should never return the same instance of items', () => {
      const doc = { type: 'string', items: [{ type: 'string' }] };
      const d = Draft4Schema.toSchema(doc) as Draft4Schema;
      expect(typeof d).toEqual('object');
      const d2 = Draft4Schema.toSchema(d as any) as Draft4Schema;
      expect(typeof d2).toEqual('object');
      const d_items: Draft4Schema[] = d.items as Draft4Schema[];
      const d2_items: Draft4Schema[] = d2.items as Draft4Schema[];
      d_items[0].id = 'test';
      expect(d_items[0].id).toEqual('test');
      expect(d2_items[0].id).not.toEqual('test');
    });
    test('should never convert value properties', () => {
      const doc = { enum: [{ test: { type: 'string' } }] };
      const d = Draft4Schema.toSchema(doc) as Draft4Schema;
      expect(typeof d).toEqual('object');
      expect(d.enum![0] instanceof Draft4Schema).toEqual(false);
    });
  });
});
