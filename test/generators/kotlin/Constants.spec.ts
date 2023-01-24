import { isReservedKotlinKeyword } from '../../../src/generators/kotlin/Constants';

describe('Reserved keywords', () => {
  it('shoud return true if the word is a reserved keyword', () => {
    expect(isReservedKotlinKeyword('as')).toBe(true);
  });

  it('should return false if the word is not a reserved keyword', () => {
    expect(isReservedKotlinKeyword('dinosaur')).toBe(false);
  });
});
