import { AbstractRenderer } from '../AbstractRenderer';
import { TemplateGenerator, TemplateOptions } from './TemplateGenerator';
import { ConstrainedMetaModel, InputMetaModel, Preset } from '../../models';
import { TemplateDependencyManager } from './TemplateDependencyManager';

/**
 * Common renderer for Template
 *
 * @extends AbstractRenderer
 */
export abstract class TemplateRenderer<
  RendererModelType extends ConstrainedMetaModel
> extends AbstractRenderer<
  TemplateOptions,
  TemplateGenerator,
  RendererModelType
> {
  constructor(
    options: TemplateOptions,
    generator: TemplateGenerator,
    presets: Array<[Preset, unknown]>,
    model: RendererModelType,
    inputModel: InputMetaModel,
    public dependencyManager: TemplateDependencyManager
  ) {
    super(options, generator, presets, model, inputModel);
  }
}
