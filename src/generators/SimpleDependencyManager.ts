import { AbstractDependencyManager } from "./AbstractDependencyManager";

export class SimpleDependencyManager extends AbstractDependencyManager {
  constructor(
    public dependencies: string[] = []
  ) {
    super(dependencies);
  }
}