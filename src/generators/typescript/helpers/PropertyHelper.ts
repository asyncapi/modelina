import { CommonModel } from '../../../models';
import { FormatHelpers } from '../../../helpers';
export const ReservedTypeScriptKeywords = [
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'enum',
  'export',
  'extends',
  'false',
  'finally',
  'for',
  'function',
  'if',
  'import',
  'in',
  'instanceof',
  'new',
  'null',
  'return',
  'super',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'any',
  'boolean',
  'constructor',
  'declare',
  'get',
  'module',
  'require',
  'number',
  'set',
  'string',
  'symbol',
  'type',
  'from',
  'of',
  // Strict mode reserved words
  'as',
  'implements',
  'interface',
  'let',
  'package',
  'private',
  'protected',
  'public',
  'static',
  'yield'
];

export function isReservedTypeScriptKeyword(word: string): boolean {
  return ReservedTypeScriptKeywords.includes(word);
}

export function getAllowedPropertyName(model: CommonModel, originalPropertyName: string, propertyName: string = originalPropertyName): string {
  propertyName = FormatHelpers.toCamelCase(propertyName);
  if (isReservedTypeScriptKeyword(propertyName)) {
    propertyName = `_${propertyName}`;
  }
  const propertyList = Object.keys(model.properties || {});
  if ((originalPropertyName !== propertyName && propertyList.includes(propertyName))) {
    propertyName = `_${propertyName}`;
    return getAllowedPropertyName(model, originalPropertyName, propertyName);
  }
  return propertyName;
}
