import { PythonGenerator } from '../../../src/generators';
import { PythonDependencyManager } from '../../../src/generators/python/PythonDependencyManager';
describe('PythonDependencyManager', () => {
  describe('renderDependencies()', () => {
    test('should render simple dependency', () => {
      const dependencyManager = new PythonDependencyManager(
        PythonGenerator.defaultOptions,
        ['import json']
      );
      expect(dependencyManager.renderDependencies()).toEqual([`import json`]);
    });
    test('should render unique dependency', () => {
      const dependencyManager = new PythonDependencyManager(
        PythonGenerator.defaultOptions,
        ['from x import y', 'from x import y2']
      );
      expect(dependencyManager.renderDependencies()).toEqual([
        `from x import y, y2`
      ]);
    });
  });
});
