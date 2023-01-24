import {
  AsyncapiV2ExternalDocumentation,
  AsyncapiV2Schema
} from '../../src/models/AsyncapiV2Schema';

describe('AsyncapiV2Schema', () => {
  describe('toSchema', () => {
    test('should throw error when trying to convert non-object', () => {
      const expectedError =
        'Could not convert input to expected copy of AsyncapiV2Schema';
      expect(() => {
        AsyncapiV2Schema.toSchema(1 as any);
      }).toThrow(expectedError);
    });
    test('should handle recursive schemas', () => {
      const recursiveDoc = { type: 'object', properties: {} };
      const doc = { type: 'object', properties: { test: recursiveDoc } };
      (recursiveDoc.properties as any)['test'] = doc;
      const d = AsyncapiV2Schema.toSchema(doc) as AsyncapiV2Schema;
      expect(typeof d).toEqual('object');
      const d2 = AsyncapiV2Schema.toSchema(d as any) as AsyncapiV2Schema;
      expect(typeof d2).toEqual('object');
    });
    test('should handle external documentation', () => {
      const doc = {
        type: 'string',
        properties: { test: { type: 'string' } },
        externalDocs: { description: 'test' }
      };
      const d = AsyncapiV2Schema.toSchema(doc) as AsyncapiV2Schema;
      expect(typeof d).toEqual('object');
      const d2 = AsyncapiV2Schema.toSchema(d as any) as AsyncapiV2Schema;
      expect(typeof d2).toEqual('object');
      expect(d.externalDocs instanceof AsyncapiV2ExternalDocumentation).toEqual(
        true
      );
      expect(d.externalDocs!.description).toEqual('test');
    });
    test('should never return the same instance of external documentation', () => {
      const doc = {
        type: 'string',
        properties: { test: { type: 'string' } },
        externalDocs: { description: 'test' }
      };
      const d = AsyncapiV2Schema.toSchema(doc) as AsyncapiV2Schema;
      expect(typeof d).toEqual('object');
      const d2 = AsyncapiV2Schema.toSchema(d as any) as AsyncapiV2Schema;
      expect(typeof d2).toEqual('object');
      d.externalDocs!.description = 'test2';
      expect(d.externalDocs!.description).toEqual('test2');
      expect(d2.externalDocs!.description).not.toEqual('test2');
    });
    test('should never return the same instance of properties', () => {
      const doc = { type: 'string', properties: { test: { type: 'string' } } };
      const d = AsyncapiV2Schema.toSchema(doc) as AsyncapiV2Schema;
      expect(typeof d).toEqual('object');
      const d2 = AsyncapiV2Schema.toSchema(d as any) as AsyncapiV2Schema;
      expect(typeof d2).toEqual('object');
      (d.properties!['test'] as AsyncapiV2Schema).$id = 'test';
      expect((d.properties!['test'] as AsyncapiV2Schema).$id).toEqual('test');
      expect((d2.properties!['test'] as AsyncapiV2Schema).$id).not.toEqual(
        'test'
      );
    });
    test('should never return the same instance of items', () => {
      const doc = { type: 'string', items: [{ type: 'string' }] };
      const d = AsyncapiV2Schema.toSchema(doc) as AsyncapiV2Schema;
      expect(typeof d).toEqual('object');
      const d2 = AsyncapiV2Schema.toSchema(d as any) as AsyncapiV2Schema;
      expect(typeof d2).toEqual('object');
      const d_items: AsyncapiV2Schema[] = d.items as AsyncapiV2Schema[];
      const d2_items: AsyncapiV2Schema[] = d2.items as AsyncapiV2Schema[];
      d_items[0].$id = 'test';
      expect(d_items[0].$id).toEqual('test');
      expect(d2_items[0].$id).not.toEqual('test');
    });
    test('should never convert value properties', () => {
      const doc = { const: { test: { type: 'string' } } };
      const d = AsyncapiV2Schema.toSchema(doc) as AsyncapiV2Schema;
      expect(typeof d).toEqual('object');
      expect(d.const instanceof AsyncapiV2Schema).toEqual(false);
    });
  });
});
