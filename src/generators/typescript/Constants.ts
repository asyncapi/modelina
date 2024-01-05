import { checkForReservedKeyword } from '../../helpers';
import { isReservedJavaScriptKeyword } from '../javascript/Constants';
import { TypeScriptOptions } from './TypeScriptGenerator';
export const RESERVED_TYPESCRIPT_KEYWORDS = [
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
  'arguments',
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

/**
 * Not only do we need to check reserved TS keywords, but we have a transitive dependency
 * on JS keywords as well because of potential transpilation process.
 */
export function isReservedTypeScriptKeyword(
  word: string,
  forceLowerCase = true,
  options: TypeScriptOptions | undefined
): boolean {
  const isTsReserved = checkForReservedKeyword(
    word,
    RESERVED_TYPESCRIPT_KEYWORDS,
    forceLowerCase
  );
  const isJsReserved = options?.useJavascriptReservedKeywords
    ? isReservedJavaScriptKeyword(word)
    : false;
  return isTsReserved || isJsReserved;
}
