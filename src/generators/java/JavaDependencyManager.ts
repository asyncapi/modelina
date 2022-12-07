import { AbstractDependencyManager } from '../AbstractDependencyManager';
import { JavaOptions } from './JavaGenerator';

export class JavaDependencyManager extends AbstractDependencyManager {
  constructor(
    public options: JavaOptions,
    dependencies: string[] = []
  ) {
    super(dependencies);
  }
}
