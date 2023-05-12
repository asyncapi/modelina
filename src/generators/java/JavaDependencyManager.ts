import { ConstrainedMetaModel } from '../../models';
import { AbstractDependencyManager } from '../AbstractDependencyManager';
import { JavaOptions } from './JavaGenerator';

export class JavaDependencyManager extends AbstractDependencyManager {
  private modelDependencies: ConstrainedMetaModel[] = [];

  constructor(public options: JavaOptions, dependencies: string[] = []) {
    super(dependencies);
  }

  renderImport(model: ConstrainedMetaModel, packageName: string): string {
    return `import ${packageName}.${model.name};`;
  }

  renderAllModelDependencies(
    model: ConstrainedMetaModel,
    packageName: string
  ): string {
    return [...this.modelDependencies, ...model.getNearestDependencies()]
      .map((dependencyModel) => {
        return this.renderImport(dependencyModel, packageName);
      })
      .join('\n');
  }

  addModelDependency(model: ConstrainedMetaModel): void {
    this.modelDependencies.push(model);
  }
}
