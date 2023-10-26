import { FormatHelpers } from '../../helpers';
import { ConstrainedMetaModel } from '../../models';
import { AbstractDependencyManager } from '../AbstractDependencyManager';
import { DartOptions } from './DartGenerator';

export class DartDependencyManager extends AbstractDependencyManager {
  constructor(
    public options: DartOptions,
    dependencies: string[] = []
  ) {
    super(dependencies);
  }

  renderImport(model: ConstrainedMetaModel, packageName: string): string {
    return `import 'package:${packageName}/${FormatHelpers.snakeCase(
      model.name
    )}.dart';`;
  }

  renderAllModelDependencies(
    model: ConstrainedMetaModel,
    packageName: string
  ): string {
    return model
      .getNearestDependencies()
      .map((dependencyModel) => {
        return this.renderImport(dependencyModel, packageName);
      })
      .join('\n');
  }
}
