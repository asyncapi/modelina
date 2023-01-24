import {
  OpenAPIV3ExternalDocumentation,
  OpenapiV3Schema,
  OpenapiV3Xml,
  OpenapiV3Discriminator
} from '../../src/models';

describe('OpenapiV3Schema', () => {
  describe('toSchema', () => {
    test('should throw error when trying to convert non-object', () => {
      const expectedError =
        'Could not convert input to expected copy of OpenapiV3Schema';
      expect(() => {
        OpenapiV3Schema.toSchema(1 as any);
      }).toThrow(expectedError);
    });
    test('should handle recursive schemas', () => {
      const recursiveDoc = { type: 'object', properties: {} };
      const doc = { type: 'object', properties: { test: recursiveDoc } };
      (recursiveDoc.properties as any)['test'] = doc;
      const d = OpenapiV3Schema.toSchema(doc) as OpenapiV3Schema;
      expect(typeof d).toEqual('object');
      const d2 = OpenapiV3Schema.toSchema(d as any) as OpenapiV3Schema;
      expect(typeof d2).toEqual('object');
    });

    test('should handle discriminator', () => {
      const doc = { discriminator: { propertyName: 'test' } };
      const d = OpenapiV3Schema.toSchema(doc) as OpenapiV3Schema;
      expect(typeof d).toEqual('object');
      const d2 = OpenapiV3Schema.toSchema(d as any) as OpenapiV3Schema;
      expect(typeof d2).toEqual('object');
      expect(d.discriminator instanceof OpenapiV3Discriminator).toEqual(true);
      expect(d.discriminator!.propertyName).toEqual('test');
    });

    test('should never return the same instance of discriminator', () => {
      const doc = { discriminator: { propertyName: 'test' } };
      const d = OpenapiV3Schema.toSchema(doc) as OpenapiV3Schema;
      expect(typeof d).toEqual('object');
      const d2 = OpenapiV3Schema.toSchema(d as any) as OpenapiV3Schema;
      expect(typeof d2).toEqual('object');
      d.discriminator!.propertyName = 'test2';
      expect(d.discriminator!.propertyName).toEqual('test2');
      expect(d2.discriminator!.propertyName).not.toEqual('test2');
    });

    test('should handle xml', () => {
      const doc = { xml: { name: 'test' } };
      const d = OpenapiV3Schema.toSchema(doc) as OpenapiV3Schema;
      expect(typeof d).toEqual('object');
      const d2 = OpenapiV3Schema.toSchema(d as any) as OpenapiV3Schema;
      expect(typeof d2).toEqual('object');
      expect(d.xml instanceof OpenapiV3Xml).toEqual(true);
      expect(d.xml!.name).toEqual('test');
    });

    test('should never return the same instance of xml', () => {
      const doc = { xml: { name: 'test' } };
      const d = OpenapiV3Schema.toSchema(doc) as OpenapiV3Schema;
      expect(typeof d).toEqual('object');
      const d2 = OpenapiV3Schema.toSchema(d as any) as OpenapiV3Schema;
      expect(typeof d2).toEqual('object');
      d.xml!.name = 'test2';
      expect(d.xml!.name).toEqual('test2');
      expect(d2.xml!.name).not.toEqual('test2');
    });

    test('should handle external documentation', () => {
      const doc = { externalDocs: { description: 'test' } };
      const d = OpenapiV3Schema.toSchema(doc) as OpenapiV3Schema;
      expect(typeof d).toEqual('object');
      const d2 = OpenapiV3Schema.toSchema(d as any) as OpenapiV3Schema;
      expect(typeof d2).toEqual('object');
      expect(d.externalDocs instanceof OpenAPIV3ExternalDocumentation).toEqual(
        true
      );
      expect(d.externalDocs!.description).toEqual('test');
    });
    test('should never return the same instance of external documentation', () => {
      const doc = { externalDocs: { description: 'test' } };
      const d = OpenapiV3Schema.toSchema(doc) as OpenapiV3Schema;
      expect(typeof d).toEqual('object');
      const d2 = OpenapiV3Schema.toSchema(d as any) as OpenapiV3Schema;
      expect(typeof d2).toEqual('object');
      d.externalDocs!.description = 'test2';
      expect(d.externalDocs!.description).toEqual('test2');
      expect(d2.externalDocs!.description).not.toEqual('test2');
    });
    test('should never return the same instance of properties', () => {
      const doc = { type: 'string', properties: { test: { type: 'string' } } };
      const d = OpenapiV3Schema.toSchema(doc) as OpenapiV3Schema;
      expect(typeof d).toEqual('object');
      const d2 = OpenapiV3Schema.toSchema(d as any) as OpenapiV3Schema;
      expect(typeof d2).toEqual('object');
      (d.properties!['test'] as OpenapiV3Schema).id = 'test';
      expect((d.properties!['test'] as OpenapiV3Schema).id).toEqual('test');
      expect((d2.properties!['test'] as OpenapiV3Schema).id).not.toEqual(
        'test'
      );
    });
    test('should never return the same instance of items', () => {
      const doc = { type: 'string', items: [{ type: 'string' }] };
      const d = OpenapiV3Schema.toSchema(doc) as OpenapiV3Schema;
      expect(typeof d).toEqual('object');
      const d2 = OpenapiV3Schema.toSchema(d as any) as OpenapiV3Schema;
      expect(typeof d2).toEqual('object');
      const d_items: OpenapiV3Schema[] = d.items as OpenapiV3Schema[];
      const d2_items: OpenapiV3Schema[] = d2.items as OpenapiV3Schema[];
      d_items[0].id = 'test';
      expect(d_items[0].id).toEqual('test');
      expect(d2_items[0].id).not.toEqual('test');
    });
    test('should never convert value properties', () => {
      const doc = { enum: [{ test: { type: 'string' } }] };
      const d = OpenapiV3Schema.toSchema(doc) as OpenapiV3Schema;
      expect(typeof d).toEqual('object');
      expect(d.enum![0] instanceof OpenapiV3Schema).toEqual(false);
    });
  });
});
