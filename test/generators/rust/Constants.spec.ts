import { isReservedRustKeyword } from '../../../src/generators/rust/Constants';

describe('Reserved keywords', () => {
  it('shoud return true if the word is a reserved keyword', () => {
    expect(isReservedRustKeyword('as')).toBe(true);
    expect(isReservedRustKeyword('async')).toBe(true);
    expect(isReservedRustKeyword('await')).toBe(true);
    expect(isReservedRustKeyword('break')).toBe(true);
    expect(isReservedRustKeyword('const')).toBe(true);
    expect(isReservedRustKeyword('continue')).toBe(true);
    expect(isReservedRustKeyword('crate')).toBe(true);
    expect(isReservedRustKeyword('dyn')).toBe(true);
    expect(isReservedRustKeyword('else')).toBe(true);
    expect(isReservedRustKeyword('enum')).toBe(true);
    expect(isReservedRustKeyword('extern')).toBe(true);
    expect(isReservedRustKeyword('false')).toBe(true);
    expect(isReservedRustKeyword('fn')).toBe(true);
    expect(isReservedRustKeyword('for')).toBe(true);
    expect(isReservedRustKeyword('if')).toBe(true);
    expect(isReservedRustKeyword('impl')).toBe(true);
    expect(isReservedRustKeyword('in')).toBe(true);
    expect(isReservedRustKeyword('let')).toBe(true);
    expect(isReservedRustKeyword('loop')).toBe(true);
    expect(isReservedRustKeyword('match')).toBe(true);
    expect(isReservedRustKeyword('mod')).toBe(true);
    expect(isReservedRustKeyword('move')).toBe(true);
    expect(isReservedRustKeyword('mut')).toBe(true);
    expect(isReservedRustKeyword('pub')).toBe(true);
    expect(isReservedRustKeyword('ref')).toBe(true);
    expect(isReservedRustKeyword('return')).toBe(true);
    expect(isReservedRustKeyword('self')).toBe(true);
    expect(isReservedRustKeyword('Self')).toBe(true);
    expect(isReservedRustKeyword('static')).toBe(true);
    expect(isReservedRustKeyword('struct')).toBe(true);
    expect(isReservedRustKeyword('super')).toBe(true);
    expect(isReservedRustKeyword('trait')).toBe(true);
    expect(isReservedRustKeyword('true')).toBe(true);
    expect(isReservedRustKeyword('try')).toBe(true);
    expect(isReservedRustKeyword('type')).toBe(true);
    expect(isReservedRustKeyword('unsafe')).toBe(true);
    expect(isReservedRustKeyword('use')).toBe(true);
    expect(isReservedRustKeyword('where')).toBe(true);
    expect(isReservedRustKeyword('while')).toBe(true);
    expect(isReservedRustKeyword('union')).toBe(true);
    expect(isReservedRustKeyword('\'static')).toBe(true);
    expect(isReservedRustKeyword('macro_rules')).toBe(true);
    expect(isReservedRustKeyword('abstract')).toBe(true);
    expect(isReservedRustKeyword('become')).toBe(true);
    expect(isReservedRustKeyword('box')).toBe(true);
    expect(isReservedRustKeyword('do')).toBe(true);
    expect(isReservedRustKeyword('final')).toBe(true);
    expect(isReservedRustKeyword('macro')).toBe(true);
    expect(isReservedRustKeyword('override')).toBe(true);
    expect(isReservedRustKeyword('priv')).toBe(true);
    expect(isReservedRustKeyword('typeof')).toBe(true);
    expect(isReservedRustKeyword('unsized')).toBe(true);
    expect(isReservedRustKeyword('yield')).toBe(true);
  });

  it('should return false if the word is not a reserved keyword', () => {
    expect(isReservedRustKeyword('dinosaur')).toBe(false);
    expect(isReservedRustKeyword('class')).toBe(false);
  });
});
