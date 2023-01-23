import { AbstractRenderer } from '../AbstractRenderer';
import { GoGenerator, GoOptions } from './GoGenerator';
import { InputMetaModel, Preset, ConstrainedMetaModel } from '../../models';
import { FormatHelpers } from '../../helpers/FormatHelpers';
import { GoDependencyManager } from './GoDependencyManager';

/**
 * Common renderer for Go types
 *
 * @extends AbstractRenderer
 */
export abstract class GoRenderer<
  RendererModelType extends ConstrainedMetaModel
> extends AbstractRenderer<GoOptions, GoGenerator, RendererModelType> {
  constructor(
    options: GoOptions,
    generator: GoGenerator,
    presets: Array<[Preset, unknown]>,
    model: RendererModelType,
    inputModel: InputMetaModel,
    public dependencyManager: GoDependencyManager
  ) {
    super(options, generator, presets, model, inputModel);
  }

  renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    return lines.map((line) => `// ${line}`).join('\n');
  }
}
