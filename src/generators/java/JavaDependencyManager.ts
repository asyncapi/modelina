import {
  ConstrainedMetaModel,
  ConstrainedReferenceModel,
  ConstrainedUnionModel
} from '../../models';
import { AbstractDependencyManager } from '../AbstractDependencyManager';
import { unionIncludesBuiltInTypes } from './JavaConstrainer';
import { JavaOptions } from './JavaGenerator';

export class JavaDependencyManager extends AbstractDependencyManager {
  private modelDependencies: ConstrainedMetaModel[] = [];

  constructor(
    public options: JavaOptions,
    dependencies: string[] = []
  ) {
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
      .filter((dependencyModel) => {
        if (dependencyModel instanceof ConstrainedUnionModel) {
          return !unionIncludesBuiltInTypes(dependencyModel);
        } else if (
          dependencyModel instanceof ConstrainedReferenceModel &&
          dependencyModel.ref instanceof ConstrainedUnionModel
        ) {
          return !unionIncludesBuiltInTypes(dependencyModel.ref);
        }
        return true;
      })
      .map((dependencyModel) => {
        return this.renderImport(dependencyModel, packageName);
      })
      .join('\n');
  }

  addModelDependency(model: ConstrainedMetaModel): void {
    this.modelDependencies.push(model);
  }
}
