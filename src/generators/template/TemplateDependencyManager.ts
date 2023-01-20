import { AbstractDependencyManager } from '../AbstractDependencyManager';
import { TemplateOptions } from './TemplateGenerator';

export class TemplateDependencyManager extends AbstractDependencyManager {
  constructor(
    public options: TemplateOptions,
    dependencies: string[] = []
  ) {
    super(dependencies);
  }
}
