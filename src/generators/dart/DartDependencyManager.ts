import { AbstractDependencyManager } from '../AbstractDependencyManager';
import { DartOptions } from './DartGenerator';

export class DartDependencyManager extends AbstractDependencyManager {
  constructor(
    public options: DartOptions,
    dependencies: string[] = []
  ) {
    super(dependencies);
  }
}
