import { isReservedScalaKeyword } from '../../../src/generators/scala/Constants';

describe('Reserved keywords', () => {
  it('should return true if the word is a reserved keyword', () => {
    expect(isReservedScalaKeyword('abstract')).toBe(true);
    expect(isReservedScalaKeyword('type')).toBe(true);
  });

  it('should return false if the word is not a reserved keyword', () => {
    expect(isReservedScalaKeyword('dinosaur')).toBe(false);
  });
});
