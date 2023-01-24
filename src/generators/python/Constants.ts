import { checkForReservedKeyword } from '../../helpers';

export const RESERVED_PYTHON_KEYWORDS = [
  'False',
  'def',
  'if',
  'raise',
  'None',
  'del',
  'import',
  'return',
  'True',
  'elif',
  'in',
  'try',
  'and',
  'else',
  'is',
  'while',
  'as',
  'except',
  'lambda',
  'with',
  'assert',
  'finally',
  'nonlocal',
  'yield',
  'break',
  'for',
  'not',
  'class',
  'from',
  'or',
  'continue',
  'global',
  'pass',
  'exec'
];

export function isReservedPythonKeyword(
  word: string,
  forceLowerCase = true
): boolean {
  return checkForReservedKeyword(
    word,
    RESERVED_PYTHON_KEYWORDS,
    forceLowerCase
  );
}
