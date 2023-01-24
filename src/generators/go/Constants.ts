import { checkForReservedKeyword } from '../../helpers';

export const RESERVED_GO_KEYWORDS = [
  'break',
  'case',
  'chan',
  'const',
  'continue',
  'default',
  'defer',
  'else',
  'fallthrough',
  'for',
  'func',
  'go',
  'goto',
  'if',
  'import',
  'interface',
  'map',
  'package',
  'range',
  'return',
  'select',
  'struct',
  'switch',
  'type',
  'var'
];

export function isReservedGoKeyword(
  word: string,
  forceLowerCase = true
): boolean {
  return checkForReservedKeyword(word, RESERVED_GO_KEYWORDS, forceLowerCase);
}
