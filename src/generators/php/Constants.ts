import { checkForReservedKeyword } from '../../helpers';

export const RESERVED_PHP_KEYWORDS = ['abstract', 'continue'];

export function isReservedPhpKeyword(
  word: string,
  forceLowerCase = true
): boolean {
  return checkForReservedKeyword(word, RESERVED_PHP_KEYWORDS, forceLowerCase);
}
