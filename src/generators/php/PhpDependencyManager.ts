import { AbstractDependencyManager } from '../AbstractDependencyManager';
import { PhpOptions } from './PhpGenerator';

export class PhpDependencyManager extends AbstractDependencyManager {
  constructor(public options: PhpOptions, dependencies: string[] = []) {
    super(dependencies);
  }
}
