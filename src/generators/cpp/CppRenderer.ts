import { AbstractRenderer } from '../AbstractRenderer';
import { CppGenerator, CppOptions } from './CppGenerator';
import { FormatHelpers } from '../../helpers/FormatHelpers';
import { ConstrainedMetaModel, InputMetaModel, Preset } from '../../models';

/**
 * Common renderer for Cpp
 * 
 * @extends AbstractRenderer
 */
export abstract class CppRenderer<RendererModelType extends ConstrainedMetaModel> extends AbstractRenderer<CppOptions, CppGenerator, RendererModelType> {
  constructor(
    options: CppOptions,
    generator: CppGenerator,
    presets: Array<[Preset, unknown]>,
    model: RendererModelType,
    inputModel: InputMetaModel,
  ) {
    super(options, generator, presets, model, inputModel);
  }

  renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    return lines.map(line => `// ${line}`).join('\n');
  }
}
