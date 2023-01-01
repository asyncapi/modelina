import { checkForReservedKeyword } from '../../helpers';

export const RESERVED_CPP_KEYWORDS = [
  'main', 
  'return'
];

export function isReservedCppKeyword(word: string, forceLowerCase = true): boolean {
  return checkForReservedKeyword(word, RESERVED_CPP_KEYWORDS, forceLowerCase);
}
