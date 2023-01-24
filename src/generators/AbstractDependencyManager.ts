export class AbstractDependencyManager {
  constructor(public dependencies: string[] = []) {}

  /**
   * Adds a dependency while ensuring that unique dependencies.
   *
   * @param dependency complete dependency string so it can be rendered as is.
   */
  addDependency(dependency: string): void {
    if (!this.dependencies.includes(dependency)) {
      this.dependencies.push(dependency);
    }
  }
}
