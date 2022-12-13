import { isReservedPhpKeyword } from '../../../src/generators/php/Constants';

describe('Reserved keywords', () => {
  it('should return true if the word is a reserved keyword', () => {
    expect(isReservedPhpKeyword('as')).toBe(true);
    expect(isReservedPhpKeyword('class')).toBe(true);
  });

  it('should return false if the word is not a reserved keyword', () => {
    expect(isReservedPhpKeyword('dinosaur')).toBe(false);
  });
});
