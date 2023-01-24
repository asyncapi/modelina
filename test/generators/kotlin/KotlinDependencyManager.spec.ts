import { KotlinGenerator } from '../../../src/generators';
import { KotlinDependencyManager } from '../../../src/generators/kotlin/KotlinDependencyManager';
describe('KotlinDependencyManager', () => {
  describe('addDependency()', () => {
    test('Should be able to render dependency', () => {
      const dependencyManager = new KotlinDependencyManager(
        KotlinGenerator.defaultOptions,
        []
      );
      dependencyManager.addDependency('javax.validation.*');
      expect(dependencyManager.dependencies).toEqual([
        'import javax.validation.*'
      ]);
    });
  });
});
