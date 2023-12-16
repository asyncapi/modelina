import { AbstractRenderer } from '../AbstractRenderer';
import { ScalaGenerator, ScalaOptions } from './ScalaGenerator';
import { ConstrainedMetaModel, InputMetaModel, Preset } from '../../models';
import { ScalaDependencyManager } from './ScalaDependencyManager';

/**
 * Common renderer for Scala
 *
 * @extends AbstractRenderer
 */
export abstract class ScalaRenderer<
  RendererModelType extends ConstrainedMetaModel
> extends AbstractRenderer<
  ScalaOptions,
  ScalaGenerator,
  RendererModelType
> {
  constructor(
    options: ScalaOptions,
    generator: ScalaGenerator,
    presets: Array<[Preset, unknown]>,
    model: RendererModelType,
    inputModel: InputMetaModel,
    public dependencyManager: ScalaDependencyManager
  ) {
    super(options, generator, presets, model, inputModel);
  }
}
