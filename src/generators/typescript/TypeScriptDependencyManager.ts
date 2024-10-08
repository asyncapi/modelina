import { AbstractDependencyManager } from '../AbstractDependencyManager';
import { renderJavaScriptDependency } from '../../helpers';
import {
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedReferenceModel
} from '../../models';
import {
  TypeScriptExportType,
  TypeScriptModelType,
  TypeScriptOptions
} from './TypeScriptGenerator';

export class TypeScriptDependencyManager extends AbstractDependencyManager {
  constructor(
    public options: TypeScriptOptions,
    dependencies: string[] = []
  ) {
    super(dependencies);
  }

  /**
   * Simple helper function to add a dependency correct based on the module system that the user defines.
   */
  addTypeScriptDependency(
    toImport: string,
    fromModule: string,
    modelType: TypeScriptModelType
  ): void {
    const dependencyImport = this.renderDependency(
      toImport,
      fromModule,
      modelType
    );
    this.addDependency(dependencyImport);
  }

  /**
   * Simple helper function to render a dependency based on the module system that the user defines.
   */
  renderDependency(
    toImport: string,
    fromModule: string,
    modelType: TypeScriptModelType
  ): string {
    return renderJavaScriptDependency(
      toImport,
      fromModule,
      this.options.moduleSystem,
      modelType === 'interface' ? 'type' : 'value'
    );
  }

  /**
   * Render the model dependencies based on the option
   */
  renderCompleteModelDependencies(
    model: ConstrainedMetaModel,
    exportType: TypeScriptExportType,
    modelType: TypeScriptModelType
  ): string {
    const isInterface =
      model instanceof ConstrainedObjectModel ||
      (model instanceof ConstrainedReferenceModel &&
        model.ref instanceof ConstrainedObjectModel);
    const dependencyObject =
      exportType === 'named' ? `{${model.name}}` : model.name;
    return this.renderDependency(
      dependencyObject,
      `./${model.name}`,
      isInterface ? modelType : 'class'
    );
  }

  /**
   * Render the exported statement for the model based on the options
   */
  renderExport(
    model: ConstrainedMetaModel,
    exportType: TypeScriptExportType,
    modelType: TypeScriptModelType
  ): string {
    const cjsExport =
      exportType === 'default'
        ? `module.exports = ${model.name};`
        : `exports.${model.name} = ${model.name};`;
    const esmExportValue =
      exportType === 'default'
        ? `export default ${model.name};\n`
        : `export { ${model.name} };`;
    const esmExportType =
      exportType === 'default'
        ? `export default ${model.name};\n`
        : `export type { ${model.name} };`;
    const esmExport =
      modelType === 'interface' && model instanceof ConstrainedObjectModel
        ? esmExportType
        : esmExportValue;
    return this.options.moduleSystem === 'CJS' ? cjsExport : esmExport;
  }
}
