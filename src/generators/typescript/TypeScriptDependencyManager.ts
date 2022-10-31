import { AbstractDependencyManager } from "../AbstractDependencyManager";
import { renderJavaScriptDependency } from "../../utils";
import { TypeScriptOptions, TypeScriptRenderCompleteModelOptions } from "./TypeScriptGenerator";
import { ConstrainedMetaModel } from "../../models";

export class TypeScriptDependencyManager extends AbstractDependencyManager {
  constructor(
    public options: TypeScriptOptions,
    dependencies: string[] = []
  ) {
    super(dependencies);
  }

  /**
   * Simple helper function to render a dependency based on the module system that the user defines.
   * 
   * @param toImport 
   * @param fromModule 
   */
  renderDependency(toImport: string, fromModule: string): string {
    return renderJavaScriptDependency(toImport, fromModule, this.options.moduleSystem);
  }

  /**
   * Simple helper function to add a dependency correct based on the module system that the user defines.
   */
  addTypeScriptDependency(toImport: string, fromModule: string) {
    const dependencyImport = this.renderDependency(toImport, fromModule);
    this.addDependency(dependencyImport);
  }

  /**
   * Render the model dependencies based on the options
   * 
   * @param model 
   * @param opt 
   * @returns 
   */
  renderCompleteModelDependencies(model: ConstrainedMetaModel, opt: TypeScriptRenderCompleteModelOptions) {
    const dependencyObject = opt.exportType === 'named' ? `{${model.name}}` : model.name;
    return renderJavaScriptDependency(dependencyObject, `./${model.name}`, this.options.moduleSystem);
  }
}