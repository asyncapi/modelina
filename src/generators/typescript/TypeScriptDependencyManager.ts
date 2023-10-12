import { AbstractDependencyManager } from '../AbstractDependencyManager';
import { renderJavaScriptDependency } from '../../helpers';
import { ConstrainedMetaModel } from '../../models';
import { TypeScriptExportType, TypeScriptOptions } from './TypeScriptGenerator';

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
  addTypeScriptDependency(toImport: string, fromModule: string): void {
    const dependencyImport = this.renderDependency(toImport, fromModule);
    this.addDependency(dependencyImport);
  }

  /**
   * Simple helper function to render a dependency based on the module system that the user defines.
   */
  renderDependency(toImport: string, fromModule: string): string {
    return renderJavaScriptDependency(
      toImport,
      fromModule,
      this.options.moduleSystem
    );
  }

  /**
   * Render the model dependencies based on the option
   */
  renderCompleteModelDependencies(
    model: ConstrainedMetaModel,
    exportType: TypeScriptExportType
  ): string {
    const dependencyObject =
      exportType === 'named' ? `{${model.name}}` : model.name;
    return this.renderDependency(dependencyObject, `./${model.name}`);
  }

  /**
   * Render the exported statement for the model based on the options
   */
  renderExport(
    model: ConstrainedMetaModel,
    exportType: TypeScriptExportType
  ): string {
    const cjsExport =
      exportType === 'default'
        ? `module.exports = ${model.name};`
        : `exports.${model.name} = ${model.name};`;
    const esmExport =
      exportType === 'default'
        ? `export default ${model.name};\n`
        : `export { ${model.name} };`;
    return this.options.moduleSystem === 'CJS' ? cjsExport : esmExport;
  }
}
