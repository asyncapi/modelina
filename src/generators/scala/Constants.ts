import { checkForReservedKeyword } from '../../helpers';

export const RESERVED_SCALA_KEYWORDS = [
  'abstract',
  'case',
  'catch',
  'class',
  'def',
  'do',
  'else',
  'extends',
  'false',
  'final',
  'finally',
  'for',
  'forSome',
  'if',
  'implicit',
  'import',
  'lazy',
  'match',
  'new',
  'null',
  'object',
  'override',
  'package',
  'private',
  'protected',
  'return',
  'sealed',
  'super',
  'this',
  'throw',
  'trait',
  'true',
  'try',
  'type',
  'val',
  'var',
  'while',
  'with',
  'yield'
];

export function isReservedScalaKeyword(
  word: string,
  forceLowerCase = true
): boolean {
  return checkForReservedKeyword(word, RESERVED_SCALA_KEYWORDS, forceLowerCase);
}
