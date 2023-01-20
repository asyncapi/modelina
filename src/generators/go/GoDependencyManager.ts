import { AbstractDependencyManager } from '../AbstractDependencyManager';
import { GoOptions } from './GoGenerator';

export class GoDependencyManager extends AbstractDependencyManager {
  constructor(
    public options: GoOptions,
    dependencies: string[] = []
  ) {
    super(dependencies);
  }
}
