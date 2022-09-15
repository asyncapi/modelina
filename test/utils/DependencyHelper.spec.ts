import {renderJavaScriptDependency} from '../../src/utils'; 

describe('DependencyHelper', () => {
  describe('renderJavaScriptDependency', () => {
    test('should render accurate CJS dependency', () => {
      const renderedDependency = renderJavaScriptDependency('test', 'test2', 'CJS');
      expect(renderedDependency).toEqual('const test = require(\'test2\');');
    });
    test('should render accurate ESM dependency', () => {
      const renderedDependency = renderJavaScriptDependency('test', 'test2', 'ESM');
      expect(renderedDependency).toEqual('import test from \'test2\';');
    });
  });
});
