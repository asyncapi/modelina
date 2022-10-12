import { AbstractDependencyManager } from "../AbstractDependencyManager";
import { renderJavaScriptDependency } from "../../utils";
import { TypeScriptOptions } from "./TypeScriptGenerator";

export class TypeScriptDependencyManager extends AbstractDependencyManager {
  constructor(
    public options: TypeScriptOptions
  ) {
    super();
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
}