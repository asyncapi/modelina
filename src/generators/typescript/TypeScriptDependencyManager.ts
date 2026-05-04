import { AbstractDependencyManager } from '../AbstractDependencyManager';
import { renderJavaScriptDependency } from '../../helpers';
import { ConstrainedEnumModel, ConstrainedMetaModel } from '../../models';
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
   * Returns true when the model is a type-only construct (interface, type alias)
   * that requires `export type` / `import type` under `isolatedModules: true`.
   * Enums are runtime values and must always use the plain export/import form.
   */
  private isTypeOnlyModel(model: ConstrainedMetaModel): boolean {
    return !(model instanceof ConstrainedEnumModel);
  }

  /**
   * Render the model dependencies based on the option
   */
  renderCompleteModelDependencies(
    model: ConstrainedMetaModel,
    exportType: TypeScriptExportType
  ): string {
    if (
      exportType === 'named' &&
      this.options.moduleSystem === 'ESM' &&
      this.options.isolatedModules &&
      this.isTypeOnlyModel(model)
    ) {
      return `import type {${model.name}} from './${model.name}';`;
    }
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

    if (this.options.moduleSystem === 'ESM') {
      if (exportType === 'default') {
        return `export default ${model.name};\n`;
      }
      if (this.options.isolatedModules && this.isTypeOnlyModel(model)) {
        return `export type { ${model.name} };`;
      }
      return `export { ${model.name} };`;
    }

    return cjsExport;
  }
}
