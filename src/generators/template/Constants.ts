import { checkForReservedKeyword } from '../../helpers';

export const RESERVED_TEMPLATE_KEYWORDS = [
  'as',
  'async',
];

export function isReservedTemplateKeyword(word: string, forceLowerCase = true): boolean {
  return checkForReservedKeyword(word, RESERVED_TEMPLATE_KEYWORDS, forceLowerCase);
}
