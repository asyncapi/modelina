import { AbstractDependencyManager } from '../AbstractDependencyManager';
import { renderJavaScriptDependency } from '../../utils';
import { ConstrainedMetaModel } from '../../models';
import { TypeScriptExportType, TypeScriptModuleSystemType } from './TypeScriptGenerator';

export class TypeScriptDependencyManager extends AbstractDependencyManager {
  constructor(
    dependencies: string[] = []
  ) {
    super(dependencies);
  }

  /**
   * Simple helper function to render a dependency based on the module system that the user defines.
   */
  renderDependency(toImport: string, fromModule: string, moduleSystem: TypeScriptModuleSystemType): string {
    return renderJavaScriptDependency(toImport, fromModule, moduleSystem);
  }

  /**
   * Simple helper function to add a dependency correct based on the module system that the user defines.
   */
  addTypeScriptDependency(toImport: string, fromModule: string, moduleSystem: TypeScriptModuleSystemType): void {
    const dependencyImport = this.renderDependency(toImport, fromModule, moduleSystem);
    this.addDependency(dependencyImport);
  }
  
  /**
   * Render the model dependencies based on the option
   */
  renderCompleteModelDependencies(model: ConstrainedMetaModel, exportType: TypeScriptExportType, moduleSystem: TypeScriptModuleSystemType): string {
    const dependencyObject = exportType === 'named' ? `{${model.name}}` : model.name;
    return renderJavaScriptDependency(dependencyObject, `./${model.name}`, moduleSystem);
  }
}
