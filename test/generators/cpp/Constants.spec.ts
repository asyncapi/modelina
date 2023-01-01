import { isReservedCppKeyword } from '../../../src/generators/cpp/Constants';

describe('Reserved keywords', () => {
  it('shoud return true if the word is a reserved keyword', () => {
    expect(isReservedCppKeyword('main')).toBe(true);
    expect(isReservedCppKeyword('return')).toBe(true);
  });

  it('should return false if the word is not a reserved keyword', () => {
    expect(isReservedCppKeyword('dinosaur')).toBe(false);
  });
});
