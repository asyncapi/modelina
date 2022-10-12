import { CommonGeneratorOptions } from "./AbstractGenerator";

export abstract class AbstractDependencyManager {
  constructor(
    public dependencies: string[] = []
  ) {}
  
  /**
   * Adds a dependency while ensuring that only one dependency is preset at a time.
   * 
   * @param dependency complete dependency string so it can be rendered as is.
   */
   addDependency(dependency: string): void {
    if (!this.dependencies.includes(dependency)) {
      this.dependencies.push(dependency);
    }
  }
}