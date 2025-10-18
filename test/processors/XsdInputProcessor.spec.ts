import * as fs from 'fs';
import * as path from 'path';
import { XsdInputProcessor } from '../../src/processors';

const basicDoc = fs.readFileSync(
  path.resolve(__dirname, './XsdInputProcessor/basic.xsd'),
  'utf8'
);

const enumDoc = fs.readFileSync(
  path.resolve(__dirname, './XsdInputProcessor/enum.xsd'),
  'utf8'
);

const attributesDoc = fs.readFileSync(
  path.resolve(__dirname, './XsdInputProcessor/attributes.xsd'),
  'utf8'
);

const arrayDoc = fs.readFileSync(
  path.resolve(__dirname, './XsdInputProcessor/array.xsd'),
  'utf8'
);

describe('XsdInputProcessor', () => {
  describe('shouldProcess()', () => {
    const processor = new XsdInputProcessor();

    test('should fail correctly for empty string input', () => {
      expect(processor.shouldProcess('')).toBeFalsy();
    });

    test('should fail correctly for empty object input', () => {
      expect(processor.shouldProcess({})).toBeFalsy();
    });

    test('should fail correctly for non-string input', () => {
      expect(processor.shouldProcess({ prop: 'hello' })).toBeFalsy();
    });

    test('should fail correctly for string without XSD indicators', () => {
      expect(processor.shouldProcess('some random string')).toBeFalsy();
    });

    test('should return true for valid XSD with xs:schema', () => {
      const result = processor.shouldProcess(
        '<?xml version="1.0"?><xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"></xs:schema>'
      );
      expect(result).toBeTruthy();
    });

    test('should return true for valid XSD with xsd:schema', () => {
      const result = processor.shouldProcess(
        '<?xml version="1.0"?><xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema"></xsd:schema>'
      );
      expect(result).toBeTruthy();
    });

    test('should return true for basic XSD document', () => {
      const result = processor.shouldProcess(basicDoc);
      expect(result).toBeTruthy();
    });
  });

  describe('process()', () => {
    test('should throw error when trying to process wrong input', async () => {
      const processor = new XsdInputProcessor();
      await expect(processor.process('not an XSD')).rejects.toThrow(
        'Input is not an XSD Schema, so it cannot be processed.'
      );
    });

    test('should throw error when trying to process non-string input', async () => {
      const processor = new XsdInputProcessor();
      await expect(processor.process({ someKey: 'someValue' })).rejects.toThrow(
        'Input is not an XSD Schema, so it cannot be processed.'
      );
    });

    test('should process basic XSD Schema with complex types', async () => {
      const processor = new XsdInputProcessor();
      const result = await processor.process(basicDoc);
      expect(result).toBeDefined();
      expect(result.models).toBeDefined();
      expect(Object.keys(result.models).length).toBeGreaterThan(0);
      expect(result).toMatchSnapshot();
    });

    test('should process XSD Schema with enumerations', async () => {
      const processor = new XsdInputProcessor();
      const result = await processor.process(enumDoc);
      expect(result).toBeDefined();
      expect(result.models).toBeDefined();
      expect(Object.keys(result.models).length).toBeGreaterThan(0);
      expect(result).toMatchSnapshot();
    });

    test('should process XSD Schema with attributes', async () => {
      const processor = new XsdInputProcessor();
      const result = await processor.process(attributesDoc);
      expect(result).toBeDefined();
      expect(result.models).toBeDefined();
      expect(Object.keys(result.models).length).toBeGreaterThan(0);
      expect(result).toMatchSnapshot();
    });

    test('should process XSD Schema with arrays (maxOccurs unbounded)', async () => {
      const processor = new XsdInputProcessor();
      const result = await processor.process(arrayDoc);
      expect(result).toBeDefined();
      expect(result.models).toBeDefined();
      expect(Object.keys(result.models).length).toBeGreaterThan(0);
      expect(result).toMatchSnapshot();
    });

    test('should process XSD Schema with xs:any elements', async () => {
      const processor = new XsdInputProcessor();
      const anyDoc = fs.readFileSync(path.join(__dirname, './XsdInputProcessor/any.xsd'), 'utf8');
      const result = await processor.process(anyDoc);
      expect(result).toBeDefined();
      expect(result.models).toBeDefined();
      expect(Object.keys(result.models).length).toBeGreaterThan(0);
      
      // Check that xs:any is converted to appropriate properties
      const flexibleType = result.models['FlexibleType'];
      expect(flexibleType).toBeDefined();
      
      expect(result).toMatchSnapshot();
    });
  });

  describe('XSD type mapping', () => {
    test('should correctly map XSD primitive types', async () => {
      const processor = new XsdInputProcessor();
      const xsdWithPrimitives = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="TestElement">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="stringField" type="xs:string"/>
        <xs:element name="intField" type="xs:int"/>
        <xs:element name="booleanField" type="xs:boolean"/>
        <xs:element name="floatField" type="xs:float"/>
        <xs:element name="dateField" type="xs:date"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>`;
      
      const result = await processor.process(xsdWithPrimitives);
      expect(result).toBeDefined();
      expect(result.models).toBeDefined();
      expect(result).toMatchSnapshot();
    });
  });
});

