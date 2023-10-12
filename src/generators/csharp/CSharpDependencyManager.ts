import { AbstractDependencyManager } from '../AbstractDependencyManager';
import { CSharpOptions } from './CSharpGenerator';

export class CSharpDependencyManager extends AbstractDependencyManager {
  constructor(
    public options: CSharpOptions,
    dependencies: string[] = []
  ) {
    super(dependencies);
  }
}
