import { FormatHelpers, IndentationTypes } from '../../src/helpers';

describe('FormatHelpers', () => {
  describe('lowerFirst', () => {
    test('should convert first char to lowercase', () => {
      const returnedText = FormatHelpers.lowerFirst('Test');
      expect(returnedText).toEqual('test');
    });
  });
  describe('breakLines', () => {
    test('should break single text', () => {
      const breakedTexts = FormatHelpers.breakLines('text1\ntext2\ntext3');
      expect(breakedTexts).toHaveLength(3);
      expect(breakedTexts).toStrictEqual(['text1', 'text2', 'text3']);
    });
    test('should support multiple lines', () => {
      const breakedTexts = FormatHelpers.breakLines([
        'text1',
        'text2',
        'text3'
      ]);
      expect(breakedTexts).toHaveLength(3);
      expect(breakedTexts).toStrictEqual(['text1', 'text2', 'text3']);
    });
  });

  describe('indent', () => {
    test('should make default indentation (with spaces)', () => {
      const content = FormatHelpers.indent('Test', 2);
      expect(content).toEqual('  Test');
    });

    test('should make default indentation', () => {
      const content = FormatHelpers.indent();
      expect(content).toEqual(' ');
    });

    test('should make indentation with no spaces', () => {
      const content = FormatHelpers.indent('Test', -1, IndentationTypes.SPACES);
      expect(content).toEqual('Test');
    });
    test('should make indentation with spaces', () => {
      const content = FormatHelpers.indent('Test', 4, IndentationTypes.SPACES);
      expect(content).toEqual('    Test');
    });

    test('should make indentation with tabs', () => {
      const content = FormatHelpers.indent('Test', 2, IndentationTypes.TABS);
      expect(content).toEqual('\t\tTest');
    });

    test('should be able to make nest indentation', () => {
      let content = FormatHelpers.indent('Test', 4, IndentationTypes.SPACES);
      content = FormatHelpers.indent(content, 2, IndentationTypes.TABS);
      expect(content).toEqual('\t\t    Test');
    });
  });

  describe('replaceSpecialCharacters', () => {
    test('should replace any special character', () => {
      const content = FormatHelpers.replaceSpecialCharacters(' !"#$%');
      expect(content).toEqual('spaceexclamationquotationhashdollarpercent');
    });

    test('should surround replaced parts with separators from each other', () => {
      const content = FormatHelpers.replaceSpecialCharacters(`&'()*+`, {
        separator: '_'
      });
      expect(content).toEqual(
        'ampersand_apostrophe_roundleft_roundright_asterisk_plus'
      );
    });

    test('should surround replaced parts with separators from text', () => {
      const content = FormatHelpers.replaceSpecialCharacters(',-.test/:;', {
        separator: '_'
      });
      expect(content).toEqual('comma_minus_dot_test_slash_colon_semicolon');
    });

    test('should surround replaced parts with separators from text at the beginning', () => {
      const content = FormatHelpers.replaceSpecialCharacters('test<=>?@[', {
        separator: '_'
      });
      expect(content).toEqual('test_less_equal_greater_question_at_squareleft');
    });

    test('should surround replaced parts with separators from text at the end', () => {
      const content = FormatHelpers.replaceSpecialCharacters('\\]^_`test', {
        separator: '_'
      });
      expect(content).toEqual(
        'backslash_squareright_circumflex_underscore_graveaccent_test'
      );
    });

    test('should exclude one special characters if defined', () => {
      const content = FormatHelpers.replaceSpecialCharacters('{|}~_', {
        separator: ' ',
        exclude: ['_']
      });
      expect(content).toEqual('curlyleft vertical curlyright tilde _');
    });

    test('should exclude many special characters if defined', () => {
      const content = FormatHelpers.replaceSpecialCharacters('{?_', {
        separator: ' ',
        exclude: ['_', '?', '{']
      });
      expect(content).toEqual('{?_');
    });
  });
});
