import { AbstractRenderer } from '../AbstractRenderer';
import { CSharpGenerator, CSharpOptions } from './CSharpGenerator';
import { Preset, ConstrainedMetaModel, InputMetaModel, ConstrainedObjectPropertyModel } from '../../models';
import { FormatHelpers } from '../../helpers/FormatHelpers';

/**
 * Common renderer for CSharp types
 * 
 * @extends AbstractRenderer
 */
export abstract class CSharpRenderer<RendererModelType extends ConstrainedMetaModel> extends AbstractRenderer<CSharpOptions, CSharpGenerator, RendererModelType> {
  constructor(
    options: CSharpOptions,
    generator: CSharpGenerator,
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

  optionalMark(propertyModel: ConstrainedObjectPropertyModel): string {
    return propertyModel.required ? '' : '?';
  }
}
