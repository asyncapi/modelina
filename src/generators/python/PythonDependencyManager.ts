import { AbstractDependencyManager } from '../AbstractDependencyManager';
import { PythonOptions } from './PythonGenerator';
import { ConstrainedMetaModel } from '../../models';

export class PythonDependencyManager extends AbstractDependencyManager {
  private readonly options: PythonOptions;

  constructor(options: PythonOptions, dependencies: string[] = []) {
    super(dependencies);
    this.options = options;
  }

  /**
   * Add a model dependency to the manager.
   */
  addModelDependency(modelName: string): void {
    // Always use explicit imports for better type hinting and to avoid circular dependencies
    this.addDependency(`from .${modelName} import ${modelName}`);
  }

  /**
   * Add a dependency to the manager.
   */
  addDependency(dependency: string): void {
    super.addDependency(dependency);
  }

  /**
   * Render a dependency for a model.
   */
  renderDependency(model: ConstrainedMetaModel): string {
    return `from .${model.name} import ${model.name}`;
  }

  /**
   * Renders all added dependencies a single time.
   *
   * For example `from typing import Dict` and `from typing import Any` would form a single import `from typing import Dict, Any`
   */
  renderDependencies(): string[] {
    let dependenciesToRender = [...this.dependencies];
    dependenciesToRender = this.mergeIndividualDependencies(dependenciesToRender);
    dependenciesToRender = this.moveFutureDependency(dependenciesToRender);
    return dependenciesToRender;
  }

  /**
   * Split up each dependency that matches `from x import y` and keep everything else as is.
   *
   * Merge all `y` together and make sure they are unique and render the dependency as `from x import y1, y2, y3`
   */
  private mergeIndividualDependencies(individualDependencies: string[]): string[] {
    const importMap: Record<string, string[]> = {};
    const dependenciesToRender = [];
    for (const dependency of individualDependencies) {
      const regex = /from ([A-Za-z0-9._]+) import ([A-Za-z0-9_\-,\s]+)/g;
      const matches = regex.exec(dependency);

      if (!matches) {
        dependenciesToRender.push(dependency);
      } else {
        const from = matches[1];
        if (!importMap[`${from}`]) {
          importMap[`${from}`] = [];
        }
        const toImport = matches[2]
          .split(',')
          .map((importMatch) => importMatch.trim());
        importMap[`${from}`].push(...toImport);
      }
    }
    for (const [from, toImport] of Object.entries(importMap)) {
      const uniqueToImport = [...new Set(toImport)];
      dependenciesToRender.push(
        `from ${from} import ${uniqueToImport.join(', ')}`
      );
    }
    return dependenciesToRender;
  }

  /**
   * If you import `from __future__ import x` it always has to be rendered first
   */
  private moveFutureDependency(individualDependencies: string[]): string[] {
    const futureDependencyIndex = individualDependencies.findIndex((element) =>
      element.includes('__future__')
    );
    if (futureDependencyIndex !== -1) {
      individualDependencies.unshift(
        individualDependencies.splice(futureDependencyIndex, 1)[0]
      );
    }
    return individualDependencies;
  }
}
