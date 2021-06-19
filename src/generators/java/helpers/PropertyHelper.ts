import { CommonModel } from '../../../models';
import { FormatHelpers } from '../../../helpers';
export const ReservedJavaKeywordList = [
  'abstract', 
  'continue', 
  'for', 
  'new', 
  'switch  assert', 
  'default', 
  'goto', 
  'package', 
  'synchronized', 
  'boolean', 
  'do', 
  'if', 
  'private', 
  'this', 
  'break', 
  'double', 
  'implements', 
  'protected', 
  'throw', 
  'byte', 
  'else', 
  'import', 
  'public', 
  'throws', 
  'case', 
  'enum', 
  'instanceof', 
  'return', 
  'transient', 
  'catch', 
  'extends', 
  'int', 
  'short', 
  'try', 
  'char', 
  'final', 
  'interface', 
  'static', 
  'void', 
  'class', 
  'finally', 
  'long', 
  'strictfp', 
  'volatile', 
  'const', 
  'float', 
  'native', 
  'super', 
  'while'
];

export function isReservedJavaKeyword(word: string): boolean {
  return ReservedJavaKeywordList.includes(word);
}
export function getAllowedPropertyName(model: CommonModel, originalPropertyName: string, propertyName: string = originalPropertyName): string {
  propertyName = FormatHelpers.toCamelCase(propertyName);
  if (isReservedJavaKeyword(propertyName)) {
    propertyName = `_${propertyName}`;
  }
  const propertyList = Object.keys(model.properties || {});
  if ((originalPropertyName !== propertyName && propertyList.includes(propertyName))) {
    propertyName = `_${propertyName}`;
    return getAllowedPropertyName(model, originalPropertyName, propertyName);
  }
  return propertyName;
}
