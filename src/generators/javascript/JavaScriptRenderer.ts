import { AbstractRenderer } from '../AbstractRenderer';
import { JavaScriptGenerator, JavaScriptOptions } from './JavaScriptGenerator';
import { FormatHelpers } from '../../helpers';
import { Preset, ConstrainedMetaModel, InputMetaModel } from '../../models';
import { JavaScriptDependencyManager } from './JavaScriptDependencyManager';

/**
 * Common renderer for JavaScript types
 *
 * @extends AbstractRenderer
 */
export abstract class JavaScriptRenderer<
  RendererModelType extends ConstrainedMetaModel
> extends AbstractRenderer<
  JavaScriptOptions,
  JavaScriptGenerator,
  RendererModelType
> {
  constructor(
    options: JavaScriptOptions,
    generator: JavaScriptGenerator,
    presets: Array<[Preset, unknown]>,
    model: RendererModelType,
    inputModel: InputMetaModel,
    public dependencyManager: JavaScriptDependencyManager
  ) {
    super(options, generator, presets, model, inputModel);
  }

  renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    const content = lines.map((line) => ` * ${line}`).join('\n');
    return `/**
${content}
 */`;
  }
}
