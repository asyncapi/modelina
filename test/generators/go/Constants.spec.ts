import { isReservedGoKeyword } from '../../../src/generators/go/Constants';

describe('Constants', () => {
  it('should return true if the word is a reserved keyword', () => {
    expect(isReservedGoKeyword('break')).toBe(true);
    expect(isReservedGoKeyword('case')).toBe(true);
    expect(isReservedGoKeyword('chan')).toBe(true);
    expect(isReservedGoKeyword('const')).toBe(true);
    expect(isReservedGoKeyword('continue')).toBe(true);
    expect(isReservedGoKeyword('default')).toBe(true);
    expect(isReservedGoKeyword('defer')).toBe(true);
    expect(isReservedGoKeyword('else')).toBe(true);
    expect(isReservedGoKeyword('fallthrough')).toBe(true);
    expect(isReservedGoKeyword('for')).toBe(true);
    expect(isReservedGoKeyword('func')).toBe(true);
    expect(isReservedGoKeyword('go')).toBe(true);
    expect(isReservedGoKeyword('goto')).toBe(true);
    expect(isReservedGoKeyword('if')).toBe(true);
    expect(isReservedGoKeyword('import')).toBe(true);
    expect(isReservedGoKeyword('interface')).toBe(true);
    expect(isReservedGoKeyword('map')).toBe(true);
    expect(isReservedGoKeyword('package')).toBe(true);
    expect(isReservedGoKeyword('range')).toBe(true);
    expect(isReservedGoKeyword('return')).toBe(true);
    expect(isReservedGoKeyword('select')).toBe(true);
    expect(isReservedGoKeyword('struct')).toBe(true);
    expect(isReservedGoKeyword('switch')).toBe(true);
    expect(isReservedGoKeyword('type')).toBe(true);
    expect(isReservedGoKeyword('var')).toBe(true);
  });

  it('should return false if the word is not a reserved keyword', () => {
    expect(isReservedGoKeyword('enum')).toBe(false);
  });
});
