import { TypeScriptGenerator } from '../../src/generators';

/**
 * Example demonstrating how to generate TypeScript models from XSD (XML Schema Definition)
 */
const xsdSchema = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" 
           targetNamespace="http://example.com/library"
           xmlns:tns="http://example.com/library"
           elementFormDefault="qualified">
  
  <!-- Simple enum type for book categories -->
  <xs:simpleType name="CategoryType">
    <xs:restriction base="xs:string">
      <xs:enumeration value="Fiction"/>
      <xs:enumeration value="Non-Fiction"/>
      <xs:enumeration value="Science"/>
      <xs:enumeration value="Biography"/>
    </xs:restriction>
  </xs:simpleType>
  
  <!-- Complex type for Book -->
  <xs:complexType name="BookType">
    <xs:sequence>
      <xs:element name="title" type="xs:string"/>
      <xs:element name="author" type="xs:string"/>
      <xs:element name="isbn" type="xs:string"/>
      <xs:element name="publishYear" type="xs:int"/>
      <xs:element name="category" type="tns:CategoryType"/>
      <xs:element name="price" type="xs:decimal"/>
    </xs:sequence>
    <xs:attribute name="id" type="xs:string" use="required"/>
  </xs:complexType>
  
  <!-- Complex type for Library with repeating books -->
  <xs:complexType name="LibraryType">
    <xs:sequence>
      <xs:element name="name" type="xs:string"/>
      <xs:element name="location" type="xs:string"/>
      <xs:element name="book" type="tns:BookType" minOccurs="0" maxOccurs="unbounded"/>
    </xs:sequence>
  </xs:complexType>
  
  <xs:element name="Library" type="tns:LibraryType"/>
  
</xs:schema>`;

const generator = new TypeScriptGenerator();
export async function generate(): Promise<void> {
  const models = await generator.generateCompleteModels(xsdSchema, {});
  for (const model of models) {
    console.log(model.result);
  }
}

if (require.main === module) {
  generate();
}
