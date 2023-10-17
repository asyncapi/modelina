import { AbstractDependencyManager } from '../AbstractDependencyManager';
import { CplusplusOptions } from './CplusplusGenerator';

export class CplusplusDependencyManager extends AbstractDependencyManager {
  constructor(
    public options: CplusplusOptions,
    dependencies: string[] = []
  ) {
    super(dependencies);
  }
}
