import { checkForReservedKeyword } from '../../helpers';

export const RESERVED_SCALA_KEYWORDS = ['abstract', 'continue'];

export function isReservedScalaKeyword(
  word: string,
  forceLowerCase = true
): boolean {
  return checkForReservedKeyword(
    word,
    RESERVED_SCALA_KEYWORDS,
    forceLowerCase
  );
}
