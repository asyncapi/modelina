import { isReservedPhpKeyword } from '../../../src/generators/php/Constants';

describe('Reserved keywords', () => {
  it('should return true if the word is a reserved keyword', () => {
    expect(isReservedPhpKeyword('abstract')).toBe(true);
    expect(isReservedPhpKeyword('continue')).toBe(true);
  });

  it('should return false if the word is not a reserved keyword', () => {
    expect(isReservedPhpKeyword('dinosaur')).toBe(false);
  });
});
