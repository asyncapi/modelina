import {
  SwaggerV2ExternalDocumentation,
  SwaggerV2Schema,
  SwaggerV2Xml
} from '../../src/models';

describe('SwaggerV2Schema', () => {
  describe('toSchema', () => {
    test('should throw error when trying to convert non-object', () => {
      const expectedError =
        'Could not convert input to expected copy of SwaggerV2Schema';
      expect(() => {
        SwaggerV2Schema.toSchema(1 as any);
      }).toThrow(expectedError);
    });
    test('should handle recursive schemas', () => {
      const recursiveDoc = { type: 'object', properties: {} };
      const doc = { type: 'object', properties: { test: recursiveDoc } };
      (recursiveDoc.properties as any)['test'] = doc;
      const d = SwaggerV2Schema.toSchema(doc) as SwaggerV2Schema;
      expect(typeof d).toEqual('object');
      const d2 = SwaggerV2Schema.toSchema(d as any) as SwaggerV2Schema;
      expect(typeof d2).toEqual('object');
    });

    test('should handle xml', () => {
      const doc = { xml: { name: 'test' } };
      const d = SwaggerV2Schema.toSchema(doc) as SwaggerV2Schema;
      expect(typeof d).toEqual('object');
      const d2 = SwaggerV2Schema.toSchema(d as any) as SwaggerV2Schema;
      expect(typeof d2).toEqual('object');
      expect(d.xml instanceof SwaggerV2Xml).toEqual(true);
      expect(d.xml!.name).toEqual('test');
    });
    test('should never return the same instance of xml', () => {
      const doc = { xml: { name: 'test' } };
      const d = SwaggerV2Schema.toSchema(doc) as SwaggerV2Schema;
      expect(typeof d).toEqual('object');
      const d2 = SwaggerV2Schema.toSchema(d as any) as SwaggerV2Schema;
      expect(typeof d2).toEqual('object');
      d.xml!.name = 'test2';
      expect(d.xml!.name).toEqual('test2');
      expect(d2.xml!.name).not.toEqual('test2');
    });

    test('should handle external documentation', () => {
      const doc = {
        type: 'string',
        properties: { test: { type: 'string' } },
        externalDocs: { description: 'test' }
      };
      const d = SwaggerV2Schema.toSchema(doc) as SwaggerV2Schema;
      expect(typeof d).toEqual('object');
      const d2 = SwaggerV2Schema.toSchema(d as any) as SwaggerV2Schema;
      expect(typeof d2).toEqual('object');
      expect(d.externalDocs instanceof SwaggerV2ExternalDocumentation).toEqual(
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
      const d = SwaggerV2Schema.toSchema(doc) as SwaggerV2Schema;
      expect(typeof d).toEqual('object');
      const d2 = SwaggerV2Schema.toSchema(d as any) as SwaggerV2Schema;
      expect(typeof d2).toEqual('object');
      d.externalDocs!.description = 'test2';
      expect(d.externalDocs!.description).toEqual('test2');
      expect(d2.externalDocs!.description).not.toEqual('test2');
    });
    test('should never return the same instance of properties', () => {
      const doc = { type: 'string', properties: { test: { type: 'string' } } };
      const d = SwaggerV2Schema.toSchema(doc) as SwaggerV2Schema;
      expect(typeof d).toEqual('object');
      const d2 = SwaggerV2Schema.toSchema(d as any) as SwaggerV2Schema;
      expect(typeof d2).toEqual('object');
      (d.properties!['test'] as SwaggerV2Schema).id = 'test';
      expect((d.properties!['test'] as SwaggerV2Schema).id).toEqual('test');
      expect((d2.properties!['test'] as SwaggerV2Schema).id).not.toEqual(
        'test'
      );
    });
    test('should never return the same instance of items', () => {
      const doc = { type: 'string', items: [{ type: 'string' }] };
      const d = SwaggerV2Schema.toSchema(doc) as SwaggerV2Schema;
      expect(typeof d).toEqual('object');
      const d2 = SwaggerV2Schema.toSchema(d as any) as SwaggerV2Schema;
      expect(typeof d2).toEqual('object');
      const d_items: SwaggerV2Schema[] = d.items as SwaggerV2Schema[];
      const d2_items: SwaggerV2Schema[] = d2.items as SwaggerV2Schema[];
      d_items[0].id = 'test';
      expect(d_items[0].id).toEqual('test');
      expect(d2_items[0].id).not.toEqual('test');
    });
    test('should never convert value properties', () => {
      const doc = { enum: [{ test: { type: 'string' } }] };
      const d = SwaggerV2Schema.toSchema(doc) as SwaggerV2Schema;
      expect(typeof d).toEqual('object');
      expect(d.enum![0] instanceof SwaggerV2Schema).toEqual(false);
    });
  });
});
