import { ConstrainedMetaModel } from '../../models';
import { AbstractDependencyManager } from '../AbstractDependencyManager';
import { PythonOptions } from './PythonGenerator';

export class PythonDependencyManager extends AbstractDependencyManager {
  constructor(
    public options: PythonOptions,
    dependencies: string[] = []
  ) {
    super(dependencies);
  }

  /**
   * Simple helper function to render a dependency based on the module system that the user defines.
   */
  renderDependency(model: ConstrainedMetaModel): string {
    const useExplicitImports = this.options.importsStyle === 'explicit';
    return `from ${useExplicitImports ? '.' : ''}${model.name} import ${
      model.name
    }`;
  }
}
