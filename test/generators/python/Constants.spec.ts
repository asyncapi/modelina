import { isReservedPythonKeyword } from '../../../src/generators/python/Constants';

describe('Reserved keywords', () => {
  it('shoud return true if the word is a reserved keyword', () => {
    expect(isReservedPythonKeyword('False')).toBe(true);
    expect(isReservedPythonKeyword('def')).toBe(true);
    expect(isReservedPythonKeyword('if')).toBe(true);
    expect(isReservedPythonKeyword('raise')).toBe(true);
    expect(isReservedPythonKeyword('None')).toBe(true);
    expect(isReservedPythonKeyword('del')).toBe(true);
    expect(isReservedPythonKeyword('import')).toBe(true);
    expect(isReservedPythonKeyword('return')).toBe(true);
    expect(isReservedPythonKeyword('True')).toBe(true);
    expect(isReservedPythonKeyword('elif')).toBe(true);
    expect(isReservedPythonKeyword('in')).toBe(true);
    expect(isReservedPythonKeyword('try')).toBe(true);
    expect(isReservedPythonKeyword('and')).toBe(true);
    expect(isReservedPythonKeyword('else')).toBe(true);
    expect(isReservedPythonKeyword('is')).toBe(true);
    expect(isReservedPythonKeyword('while')).toBe(true);
    expect(isReservedPythonKeyword('as')).toBe(true);
    expect(isReservedPythonKeyword('except')).toBe(true);
    expect(isReservedPythonKeyword('lambda')).toBe(true);
    expect(isReservedPythonKeyword('with')).toBe(true);
    expect(isReservedPythonKeyword('assert')).toBe(true);
    expect(isReservedPythonKeyword('finally')).toBe(true);
    expect(isReservedPythonKeyword('nonlocal')).toBe(true);
    expect(isReservedPythonKeyword('yield')).toBe(true);
    expect(isReservedPythonKeyword('break')).toBe(true);
    expect(isReservedPythonKeyword('for')).toBe(true);
    expect(isReservedPythonKeyword('not')).toBe(true);
    expect(isReservedPythonKeyword('class')).toBe(true);
    expect(isReservedPythonKeyword('from')).toBe(true);
    expect(isReservedPythonKeyword('or')).toBe(true);
    expect(isReservedPythonKeyword('continue')).toBe(true);
    expect(isReservedPythonKeyword('global')).toBe(true);
    expect(isReservedPythonKeyword('pass')).toBe(true);
    expect(isReservedPythonKeyword('exec')).toBe(true);
  });

  it('should return false if the word is not a reserved keyword', () => {
    expect(isReservedPythonKeyword('dinosaur')).toBe(false);
  });
});
