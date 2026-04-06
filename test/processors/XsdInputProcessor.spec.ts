import * as fs from 'fs';
import * as path from 'path';
import { XMLParser } from 'fast-xml-parser';
import { XsdInputProcessor } from '../../src/processors';
import { XsdSchema } from '../../src/models/XsdSchema';

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

const simpleContentDoc = fs.readFileSync(
  path.resolve(__dirname, './XsdInputProcessor/simple-content.xsd'),
  'utf8'
);

const complexContentDoc = fs.readFileSync(
  path.resolve(__dirname, './XsdInputProcessor/complex-content.xsd'),
  'utf8'
);

const patternRestrictionsDoc = fs.readFileSync(
  path.resolve(__dirname, './XsdInputProcessor/pattern-restrictions.xsd'),
  'utf8'
);

const inlineSimpleTypeDoc = fs.readFileSync(
  path.resolve(__dirname, './XsdInputProcessor/inline-simple-type.xsd'),
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
      const anyDoc = fs.readFileSync(
        path.join(__dirname, './XsdInputProcessor/any.xsd'),
        'utf8'
      );
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

  describe('simpleContent parsing', () => {
    test('should process XSD with simpleContent extension', async () => {
      const processor = new XsdInputProcessor();
      const result = await processor.process(simpleContentDoc);
      expect(result).toBeDefined();
      expect(result.models).toBeDefined();
      expect(result).toMatchSnapshot();
    });

    test('should parse simpleContent extension directly via XsdSchema', () => {
      const xsd = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:complexType name="ExtendedString">
    <xs:simpleContent>
      <xs:extension base="xs:string">
        <xs:attribute name="lang" type="xs:language" use="optional" default="en"/>
      </xs:extension>
    </xs:simpleContent>
  </xs:complexType>
</xs:schema>`;

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        parseAttributeValue: true,
        trimValues: true
      });
      const parsed = parser.parse(xsd);
      const schema = XsdSchema.toSchema(parsed);

      expect(schema.complexTypes).toBeDefined();
      expect(schema.complexTypes!.length).toBe(1);
      const ct = schema.complexTypes![0];
      expect(ct.name).toBe('ExtendedString');
      expect(ct.simpleContent).toBeDefined();
      expect(ct.simpleContent!.extension).toBeDefined();
      expect(ct.simpleContent!.extension!.base).toBe('xs:string');
      expect(ct.simpleContent!.extension!.attributes).toBeDefined();
      expect(ct.simpleContent!.extension!.attributes!.length).toBe(1);
      expect(ct.simpleContent!.extension!.attributes![0].name).toBe('lang');
    });

    test('should handle simpleContent with no inner nodes', () => {
      // When simpleContent is empty (empty string in parsed XML), the fast-xml-parser
      // returns an empty string for the node, so parseComplexType sees it as falsy and
      // skips setting simpleContent entirely.
      const xsd = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:complexType name="EmptySimpleContent">
    <xs:simpleContent>
    </xs:simpleContent>
  </xs:complexType>
</xs:schema>`;

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        parseAttributeValue: true,
        trimValues: true
      });
      const parsed = parser.parse(xsd);
      const schema = XsdSchema.toSchema(parsed);

      expect(schema.complexTypes).toBeDefined();
      const ct = schema.complexTypes![0];
      // Empty simpleContent is skipped by the parser (falsy empty string node)
      expect(ct.simpleContent).toBeUndefined();
    });
  });

  describe('complexContent parsing', () => {
    test('should process XSD with complexContent extension', async () => {
      const processor = new XsdInputProcessor();
      const result = await processor.process(complexContentDoc);
      expect(result).toBeDefined();
      expect(result.models).toBeDefined();
      expect(result).toMatchSnapshot();
    });

    test('should parse complexContent extension via XsdSchema', () => {
      const xsd = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:complexType name="Vehicle">
    <xs:sequence>
      <xs:element name="make" type="xs:string"/>
      <xs:element name="model" type="xs:string"/>
    </xs:sequence>
  </xs:complexType>
  <xs:complexType name="Car">
    <xs:complexContent>
      <xs:extension base="Vehicle">
        <xs:sequence>
          <xs:element name="doors" type="xs:int"/>
        </xs:sequence>
        <xs:attribute name="vin" type="xs:string" use="required"/>
      </xs:extension>
    </xs:complexContent>
  </xs:complexType>
</xs:schema>`;

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        parseAttributeValue: true,
        trimValues: true
      });
      const parsed = parser.parse(xsd);
      const schema = XsdSchema.toSchema(parsed);

      expect(schema.complexTypes).toBeDefined();
      expect(schema.complexTypes!.length).toBe(2);
      const car = schema.complexTypes!.find((ct) => ct.name === 'Car');
      expect(car).toBeDefined();
      expect(car!.complexContent).toBeDefined();
      expect(car!.complexContent!.extension).toBeDefined();
      expect(car!.complexContent!.extension!.base).toBe('Vehicle');
      expect(car!.complexContent!.extension!.sequence).toBeDefined();
      expect(car!.complexContent!.extension!.sequence!.elements!.length).toBe(
        1
      );
      expect(car!.complexContent!.extension!.attributes).toBeDefined();
      expect(car!.complexContent!.extension!.attributes!.length).toBe(1);
      expect(car!.complexContent!.extension!.attributes![0].name).toBe('vin');
    });

    test('should parse complexContent extension with no sequence', () => {
      const xsd = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:complexType name="NamedBase">
    <xs:sequence>
      <xs:element name="id" type="xs:int"/>
    </xs:sequence>
  </xs:complexType>
  <xs:complexType name="NamedChild">
    <xs:complexContent>
      <xs:extension base="NamedBase">
        <xs:attribute name="extra" type="xs:string"/>
      </xs:extension>
    </xs:complexContent>
  </xs:complexType>
</xs:schema>`;

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        parseAttributeValue: true,
        trimValues: true
      });
      const parsed = parser.parse(xsd);
      const schema = XsdSchema.toSchema(parsed);

      const child = schema.complexTypes!.find((ct) => ct.name === 'NamedChild');
      expect(child!.complexContent!.extension!.sequence).toBeUndefined();
      expect(child!.complexContent!.extension!.attributes).toBeDefined();
    });
  });

  describe('simpleType constraint parsing', () => {
    test('should process XSD with pattern and length restrictions', async () => {
      const processor = new XsdInputProcessor();
      const result = await processor.process(patternRestrictionsDoc);
      expect(result).toBeDefined();
      expect(result.models).toBeDefined();
      expect(result).toMatchSnapshot();
    });

    test('should parse pattern restriction via XsdSchema', () => {
      const xsd = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:simpleType name="ZipCode">
    <xs:restriction base="xs:string">
      <xs:pattern value="[0-9]{5}(-[0-9]{4})?"/>
    </xs:restriction>
  </xs:simpleType>
</xs:schema>`;

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        parseAttributeValue: true,
        trimValues: true
      });
      const parsed = parser.parse(xsd);
      const schema = XsdSchema.toSchema(parsed);

      expect(schema.simpleTypes).toBeDefined();
      expect(schema.simpleTypes!.length).toBe(1);
      const st = schema.simpleTypes![0];
      expect(st.name).toBe('ZipCode');
      expect(st.restriction).toBeDefined();
      expect(st.restriction!.base).toBe('xs:string');
      expect(st.restriction!.pattern).toBeDefined();
      expect(st.restriction!.pattern).toBe('[0-9]{5}(-[0-9]{4})?');
    });

    test('should parse minLength and maxLength restrictions', () => {
      const xsd = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:simpleType name="Username">
    <xs:restriction base="xs:string">
      <xs:minLength value="3"/>
      <xs:maxLength value="32"/>
    </xs:restriction>
  </xs:simpleType>
</xs:schema>`;

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        parseAttributeValue: true,
        trimValues: true
      });
      const parsed = parser.parse(xsd);
      const schema = XsdSchema.toSchema(parsed);

      const st = schema.simpleTypes![0];
      expect(st.restriction!.minLength).toBe(3);
      expect(st.restriction!.maxLength).toBe(32);
    });

    test('should parse minInclusive and maxInclusive numeric constraints', () => {
      const xsd = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:simpleType name="PositiveScore">
    <xs:restriction base="xs:decimal">
      <xs:minInclusive value="1"/>
      <xs:maxInclusive value="10"/>
    </xs:restriction>
  </xs:simpleType>
</xs:schema>`;

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        parseAttributeValue: true,
        trimValues: true
      });
      const parsed = parser.parse(xsd);
      const schema = XsdSchema.toSchema(parsed);

      const st = schema.simpleTypes![0];
      expect(st.restriction!.minInclusive).toBe(1);
      expect(st.restriction!.maxInclusive).toBe(10);
    });

    test('should parse minLength-only restriction', () => {
      const xsd = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:simpleType name="NonEmpty">
    <xs:restriction base="xs:string">
      <xs:minLength value="1"/>
    </xs:restriction>
  </xs:simpleType>
</xs:schema>`;

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        parseAttributeValue: true,
        trimValues: true
      });
      const parsed = parser.parse(xsd);
      const schema = XsdSchema.toSchema(parsed);

      const st = schema.simpleTypes![0];
      expect(st.restriction!.minLength).toBe(1);
      expect(st.restriction!.maxLength).toBeUndefined();
    });

    test('should parse maxLength-only restriction', () => {
      const xsd = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:simpleType name="ShortLabel">
    <xs:restriction base="xs:string">
      <xs:maxLength value="20"/>
    </xs:restriction>
  </xs:simpleType>
</xs:schema>`;

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        parseAttributeValue: true,
        trimValues: true
      });
      const parsed = parser.parse(xsd);
      const schema = XsdSchema.toSchema(parsed);

      const st = schema.simpleTypes![0];
      expect(st.restriction!.maxLength).toBe(20);
      expect(st.restriction!.minLength).toBeUndefined();
    });

    test('should parse minInclusive-only numeric constraint', () => {
      const xsd = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:simpleType name="PositiveInt">
    <xs:restriction base="xs:integer">
      <xs:minInclusive value="1"/>
    </xs:restriction>
  </xs:simpleType>
</xs:schema>`;

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        parseAttributeValue: true,
        trimValues: true
      });
      const parsed = parser.parse(xsd);
      const schema = XsdSchema.toSchema(parsed);

      const st = schema.simpleTypes![0];
      expect(st.restriction!.minInclusive).toBe(1);
      expect(st.restriction!.maxInclusive).toBeUndefined();
    });

    test('should parse maxInclusive-only numeric constraint', () => {
      const xsd = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:simpleType name="MaxHundred">
    <xs:restriction base="xs:integer">
      <xs:maxInclusive value="100"/>
    </xs:restriction>
  </xs:simpleType>
</xs:schema>`;

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        parseAttributeValue: true,
        trimValues: true
      });
      const parsed = parser.parse(xsd);
      const schema = XsdSchema.toSchema(parsed);

      const st = schema.simpleTypes![0];
      expect(st.restriction!.maxInclusive).toBe(100);
      expect(st.restriction!.minInclusive).toBeUndefined();
    });
  });

  describe('inline simpleType within element', () => {
    test('should process XSD with inline simpleType in element', async () => {
      const processor = new XsdInputProcessor();
      const result = await processor.process(inlineSimpleTypeDoc);
      expect(result).toBeDefined();
      expect(result.models).toBeDefined();
      expect(result).toMatchSnapshot();
    });

    test('should parse element with inline simpleType via XsdSchema', () => {
      const xsd = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="Order">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="priority">
          <xs:simpleType>
            <xs:restriction base="xs:string">
              <xs:enumeration value="low"/>
              <xs:enumeration value="medium"/>
              <xs:enumeration value="high"/>
            </xs:restriction>
          </xs:simpleType>
        </xs:element>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>`;

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        parseAttributeValue: true,
        trimValues: true
      });
      const parsed = parser.parse(xsd);
      const schema = XsdSchema.toSchema(parsed);

      expect(schema.elements).toBeDefined();
      const order = schema.elements![0];
      expect(order.name).toBe('Order');
      expect(order.complexType).toBeDefined();
      expect(order.complexType!.sequence).toBeDefined();
      const priorityElement = order.complexType!.sequence!.elements![0];
      expect(priorityElement.name).toBe('priority');
      expect(priorityElement.simpleType).toBeDefined();
      expect(priorityElement.simpleType!.restriction).toBeDefined();
      expect(
        priorityElement.simpleType!.restriction!.enumeration
      ).toBeDefined();
      expect(priorityElement.simpleType!.restriction!.enumeration!.length).toBe(
        3
      );
    });
  });

  describe('XsdSchema.toSchema edge cases', () => {
    test('should return empty schema for empty object input', () => {
      // Passing {} results in no xs:schema or schema key, so schema fields remain undefined
      const schema = XsdSchema.toSchema({});
      expect(schema).toBeDefined();
      expect(schema.elements).toBeUndefined();
      expect(schema.complexTypes).toBeUndefined();
      expect(schema.simpleTypes).toBeUndefined();
    });

    test('should return empty schema for input without xs:schema node', () => {
      const schema = XsdSchema.toSchema({});
      expect(schema).toBeDefined();
      expect(schema.elements).toBeUndefined();
    });

    test('should parse schema targetNamespace and form defaults', () => {
      const xsd = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  targetNamespace="http://example.com/ns"
  elementFormDefault="qualified"
  attributeFormDefault="unqualified">
  <xs:element name="Root" type="xs:string"/>
</xs:schema>`;

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        parseAttributeValue: true,
        trimValues: true
      });
      const parsed = parser.parse(xsd);
      const schema = XsdSchema.toSchema(parsed);

      expect(schema.targetNamespace).toBe('http://example.com/ns');
      expect(schema.elementFormDefault).toBe('qualified');
      expect(schema.attributeFormDefault).toBe('unqualified');
    });
  });
});
