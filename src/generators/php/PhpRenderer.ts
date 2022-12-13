import { AbstractRenderer } from '../AbstractRenderer';
import { PhpGenerator, TemplateOptions } from './PhpGenerator';
import { ConstrainedMetaModel, InputMetaModel, Preset } from '../../models';

/**
 * Common renderer for Template
 * 
 * @extends AbstractRenderer
 */
export abstract class PhpRenderer<RendererModelType extends ConstrainedMetaModel> extends AbstractRenderer<TemplateOptions, PhpGenerator, RendererModelType> {
  constructor(
    options: TemplateOptions,
    generator: PhpGenerator,
    presets: Array<[Preset, unknown]>,
    model: RendererModelType, 
    inputModel: InputMetaModel,
  ) {
    super(options, generator, presets, model, inputModel);
  }
}
