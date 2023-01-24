import { isReservedTemplateKeyword } from '../../../src/generators/template/Constants';

describe('Reserved keywords', () => {
  it('shoud return true if the word is a reserved keyword', () => {
    expect(isReservedTemplateKeyword('as')).toBe(true);
    expect(isReservedTemplateKeyword('async')).toBe(true);
  });

  it('should return false if the word is not a reserved keyword', () => {
    expect(isReservedTemplateKeyword('dinosaur')).toBe(false);
  });
});
