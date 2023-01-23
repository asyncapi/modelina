import { AbstractRenderer } from '../AbstractRenderer';
import { PythonGenerator, PythonOptions } from './PythonGenerator';
import { ConstrainedMetaModel, InputMetaModel, Preset } from '../../models';
import { FormatHelpers } from '../../helpers';
import { PythonDependencyManager } from './PythonDependencyManager';

/**
 * Common renderer for Python
 *
 * @extends AbstractRenderer
 */
export abstract class PythonRenderer<
  RendererModelType extends ConstrainedMetaModel
> extends AbstractRenderer<PythonOptions, PythonGenerator, RendererModelType> {
  constructor(
    options: PythonOptions,
    generator: PythonGenerator,
    presets: Array<[Preset, unknown]>,
    model: RendererModelType,
    inputModel: InputMetaModel,
    public dependencyManager: PythonDependencyManager
  ) {
    super(options, generator, presets, model, inputModel);
  }

  renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    const content = lines.join('\n');
    return `"""
${content}
"""`;
  }
}
