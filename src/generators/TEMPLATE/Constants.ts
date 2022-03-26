//Standard reserved keywords
export const RESERVED_TEMPLATE_KEYWORDS = [''];

export function isReservedTemplateKeyword(word: string): boolean {
    return RESERVED_TEMPLATE_KEYWORDS.includes(word);
}
  