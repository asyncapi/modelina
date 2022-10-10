<<<<<<< HEAD
import { checkForReservedKeyword } from '../../helpers';

=======
>>>>>>> master-github-upstream
export const RESERVED_DART_KEYWORDS = [
  'abstract', 
  'as',
  'assert',
  'async',
  'await',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'covariant',
  'default',
  'deferred',
  'do',
  'dynamic',
  'else',
  'enum',
  'export',
  'extends',
  'extension',
  'external',
  'factory',
  'false',
  'final',
  'for',
  'Function',
  'get',
  'get',
  'hide',
  'if',
  'implements',
  'import',
  'in',
  'interface',
  'is',
  'late',
  'library',
  'mixin',
  'new',
  'null',
  'on',
  'operator',
  'part',
  'required',
  'rethrow',
  'return',
  'set',
  'show',
  'static',
  'super',
  'switch',
  'sync',
  'this',
  'throw',
  'true',
  'try',
  'typedef',
  'var',
  'void',
  'while',
  'with',
  'yield',
];

<<<<<<< HEAD
export function isReservedDartKeyword(word: string, forceLowerCase = true): boolean {
  return checkForReservedKeyword(word, RESERVED_DART_KEYWORDS, forceLowerCase);
=======
export function isReservedDartKeyword(word: string): boolean {
  return RESERVED_DART_KEYWORDS.includes(word);
>>>>>>> master-github-upstream
}
