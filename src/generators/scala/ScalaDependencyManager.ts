import { AbstractDependencyManager } from '../AbstractDependencyManager';
import { ScalaOptions } from './ScalaGenerator';

export class ScalaDependencyManager extends AbstractDependencyManager {
  constructor(
    public options: ScalaOptions,
    dependencies: string[] = []
  ) {
    super(dependencies);
  }
}
