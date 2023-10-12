import { AbstractDependencyManager } from '../AbstractDependencyManager';
import { KotlinOptions } from './KotlinGenerator';

export class KotlinDependencyManager extends AbstractDependencyManager {
  constructor(
    public options: KotlinOptions,
    dependencies: string[] = []
  ) {
    super(dependencies);
  }

  /**
   * Adds a dependency package ensuring correct syntax.
   *
   * @param dependencyPackage package to import, for example `javax.validation.constraints.*`
   */
  addDependency(dependencyPackage: string): void {
    super.addDependency(`import ${dependencyPackage}`);
  }
}
