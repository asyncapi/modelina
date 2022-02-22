export const RESERVED_GO_KEYWORDS = [
  'break',
  'case',
  'chan',
  'const',
  'continue',
  'default',
  'defer',
  'else',
  'enum',
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

export function isReservedGoKeyword(word: string): boolean {
  return RESERVED_GO_KEYWORDS.includes(word);
}
