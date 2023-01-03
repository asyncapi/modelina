import { AbstractRenderer } from '../AbstractRenderer';
import { KotlinGenerator, KotlinOptions } from './KotlinGenerator';
import { ConstrainedMetaModel, InputMetaModel, Preset } from '../../models';
import {FormatHelpers} from '../../helpers';

/**
 * Common renderer for Kotlin
 * 
 * @extends AbstractRenderer
 */
export abstract class KotlinRenderer<RendererModelType extends ConstrainedMetaModel> extends AbstractRenderer<KotlinOptions, KotlinGenerator, RendererModelType> {
  constructor(
    options: KotlinOptions,
    generator: KotlinGenerator,
    presets: Array<[Preset, unknown]>,
    model: RendererModelType, 
    inputModel: InputMetaModel,
  ) {
    super(options, generator, presets, model, inputModel);
  }

  renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    const newLiteral = lines.map(line => ` * ${line}`).join('\n');
    return `/**
${newLiteral}
 */`;
  }
}
