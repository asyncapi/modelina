import { TypeScriptGenerator } from '../../../src/generators';
import { TypeScriptDependencyManager } from '../../../src/generators/typescript/TypeScriptDependencyManager';
describe('TypeScriptDependencyManager', () => {
  describe('renderDependency()', () => {
    test('Should be able to render dependency', () => {
      const dependencyManager = new TypeScriptDependencyManager(
        TypeScriptGenerator.defaultOptions,
        []
      );
      expect(
        dependencyManager.renderDependency('someComment', 'someComment2')
      ).toEqual(`import someComment from 'someComment2';`);
    });
  });
});
