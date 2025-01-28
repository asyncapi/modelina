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
        ['from x import y', 'from x import y2', 'from x import y_2']
      );
      expect(dependencyManager.renderDependencies()).toEqual([
        'from x import y, y2, y_2'
      ]);
    });
    test('should render __future__ dependency first', () => {
      const dependencyManager = new PythonDependencyManager(
        PythonGenerator.defaultOptions,
        ['from x import y', 'from __future__ import y']
      );
      expect(dependencyManager.renderDependencies()).toEqual([
        'from __future__ import y',
        'from x import y'
      ]);
    });
  });
});
