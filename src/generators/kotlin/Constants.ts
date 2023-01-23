/**
 * For the full list of Kotlin keywords, refer to the reference documentation.
 * https://kotlinlang.org/docs/keyword-reference.html
 */

import { checkForReservedKeyword } from '../../helpers';

export const RESERVED_KEYWORDS_ILLEGAL_AS_PARAMETER = [
  'as',
  'as?',
  'break',
  'class',
  'continue',
  'do',
  'else',
  'false',
  'for',
  'fun',
  'if',
  'in',
  '!in',
  'interface',
  'is',
  '!is',
  'null',
  'object',
  'package',
  'return',
  'super',
  'this',
  'throw',
  'true',
  'try',
  'typealias',
  'typeof',
  'val',
  'var',
  'when',
  'while'
];

export const ILLEGAL_ENUM_FIELDS = ['as?', '!in', '!is'];

export function isInvalidKotlinEnumKey(word: string): boolean {
  return checkForReservedKeyword(word, ILLEGAL_ENUM_FIELDS, true);
}

export function isReservedKotlinKeyword(
  word: string,
  forceLowerCase = true
): boolean {
  return checkForReservedKeyword(
    word,
    RESERVED_KEYWORDS_ILLEGAL_AS_PARAMETER,
    forceLowerCase
  );
}
