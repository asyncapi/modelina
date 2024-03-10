import { checkForReservedKeyword } from '../../helpers';
import {
  ConstrainedObjectPropertyModel,
  ConstrainedEnumModel,
  ConstrainedReferenceModel
} from '../../models';

export const RESERVED_CSHARP_KEYWORDS = [
  'abstract',
  'as',
  'base',
  'bool',
  'break',
  'byte',
  'case',
  'catch',
  'char',
  'checked',
  'class',
  'const',
  'continue',
  'decimal',
  'default',
  'delegate',
  'do',
  'double',
  'else',
  'enum',
  'event',
  'explicit',
  'extern',
  'false',
  'finally',
  'fixed',
  'float',
  'for',
  'foreach',
  'goto',
  'if',
  'implicit',
  'in',
  'int',
  'interface',
  'internal',
  'is',
  'lock',
  'long',
  'namespace',
  'new',
  'null',
  'object',
  'operator',
  'out',
  'override',
  'params',
  'private',
  'protected',
  'public',
  'readonly',
  'record',
  'ref',
  'return',
  'sbyte',
  'sealed',
  'short',
  'sizeof',
  'stackalloc',
  'static',
  'string',
  'struct',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'typeof',
  'uint',
  'ulong',
  'unchecked',
  'unsafe',
  'ushort',
  'using',
  'virtual',
  'void',
  'volatile',
  'while'
];

export function isReservedCSharpKeyword(
  word: string,
  forceLowerCase = true
): boolean {
  return checkForReservedKeyword(
    word,
    RESERVED_CSHARP_KEYWORDS,
    forceLowerCase
  );
}

const STRING_RENDERING_TYPES = [
  'System.TimeSpan',
  'System.DateTime',
  'System.DateTimeOffset',
  'System.Guid'
];

const PRIMITIVES = [
  'bool',
  'byte',
  'sbyte',
  'char',
  'decimal',
  'double',
  'float',
  'int',
  'uint',
  'long',
  'ulong',
  'short',
  'ushort'
];

export function isStringRenderingType(
  property: ConstrainedObjectPropertyModel
): boolean {
  return STRING_RENDERING_TYPES.includes(property.property.type);
}

export function isPrimitive(property: ConstrainedObjectPropertyModel): boolean {
  return PRIMITIVES.includes(property.property.type);
}

export function isEnum(property: ConstrainedObjectPropertyModel): boolean {
  if (
    property.property &&
    property.property instanceof ConstrainedReferenceModel &&
    property.property.ref !== undefined &&
    property.property.ref instanceof ConstrainedEnumModel
  ) {
    return true;
  }

  return false;
}
