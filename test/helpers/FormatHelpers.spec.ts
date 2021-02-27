import { FormatHelpers, IndentationTypes } from '../../src/helpers'; 

describe('FormatHelpers', function() {
  describe('breakLines', function() {
    test('should break single text', function() {  
      const breakedTexts = FormatHelpers.breakLines(`text\ntext2\ntext3`);
  
      expect(breakedTexts).toHaveLength(3);
      expect(breakedTexts).toStrictEqual(['text', 'text2', 'text3']);
    });
  });

  describe('indent', function() {
    test('should make default indentation (with spaces)', () => {
      const content = FormatHelpers.indent(`Test`, 2);
      expect(content).toEqual('  Test');
    });

    test('should make indentation with no spaces', () => {
      const content = FormatHelpers.indent(`Test`, -1, IndentationTypes.SPACES);
      expect(content).toEqual('Test');
    });
    test('should make indentation with spaces', () => {
      const content = FormatHelpers.indent(`Test`, 4, IndentationTypes.SPACES);
      expect(content).toEqual('    Test');
    });
  
    test('should make indentation with tabs', () => {
      const content = FormatHelpers.indent(`Test`, 2, IndentationTypes.TABS);
      expect(content).toEqual('\t\tTest');
    });
  
    test('should be able to make nest indentation', () => {
      let content = FormatHelpers.indent(`Test`, 4, IndentationTypes.SPACES);
      content = FormatHelpers.indent(content, 2, IndentationTypes.TABS);
      expect(content).toEqual('\t\t    Test');
    });
  });
});
