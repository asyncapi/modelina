import { checkForReservedKeyword } from '../../helpers';

export const RESERVED_TEMPLATE_KEYWORDS = ['abstract', 'continue'];

export function isReservedTemplateKeyword(
  word: string,
  forceLowerCase = true
): boolean {
  return checkForReservedKeyword(
    word,
    RESERVED_TEMPLATE_KEYWORDS,
    forceLowerCase
  );
}
