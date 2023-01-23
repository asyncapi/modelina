import { checkForReservedKeyword } from '../../helpers';

export const RESERVED_RUST_KEYWORDS = [
  // strict keywords can only be used in correct context, and are therefore invalid as:
  // Items, variables and function parameters, fields and vairants, type parameters, lifetime parameters, loop labels, macros or attributes, macro placeholders
  // https://doc.rust-lang.org/reference/keywords.html#strict-keywords
  'as',
  'async',
  'await',
  'break',
  'const',
  'continue',
  'crate',
  'dyn',
  'else',
  'enum',
  'extern',
  'false',
  'fn',
  'for',
  'if',
  'impl',
  'in',
  'let',
  'loop',
  'match',
  'mod',
  'move',
  'mut',
  'pub',
  'ref',
  'return',
  'self',
  'Self',
  'static',
  'struct',
  'super',
  'trait',
  'true',
  'try',
  'type',
  'unsafe',
  'use',
  'where',
  'while',
  // weak keywrods
  // these keywords have special meaning only in certain contexts, but are included as reserved keywords here for simplicity
  'union',
  "'static",
  'macro_rules',
  // keywords reserved for future use
  // https://doc.rust-lang.org/reference/keywords.html#reserved-keywords
  'abstract',
  'become',
  'box',
  'do',
  'final',
  'macro',
  'override',
  'priv',
  'typeof',
  'unsized',
  'yield'
];

export function isReservedRustKeyword(word: string): boolean {
  return checkForReservedKeyword(word, RESERVED_RUST_KEYWORDS, false);
}
