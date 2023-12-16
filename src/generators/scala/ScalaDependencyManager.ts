import { AbstractDependencyManager } from '../AbstractDependencyManager';
import { ScalaOptions } from './ScalaGenerator';

export class ScalaDependencyManager extends AbstractDependencyManager {
  constructor(public options: ScalaOptions, dependencies: string[] = []) {
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
