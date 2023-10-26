import { AbstractDependencyManager } from '../AbstractDependencyManager';
import { RustOptions } from './RustGenerator';

export class RustDependencyManager extends AbstractDependencyManager {
  constructor(
    public options: RustOptions,
    dependencies: string[] = []
  ) {
    super(dependencies);
  }
}
