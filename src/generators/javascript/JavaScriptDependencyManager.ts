import { renderJavaScriptDependency } from '../../helpers';
import { AbstractDependencyManager } from '../AbstractDependencyManager';
import { JavaScriptOptions } from './JavaScriptGenerator';

export class JavaScriptDependencyManager extends AbstractDependencyManager {
  constructor(
    public options: JavaScriptOptions,
    dependencies: string[] = []
  ) {
    super(dependencies);
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
}
