import { AbstractRenderer } from '../AbstractRenderer';
import { CplusplusGenerator, CplusplusOptions } from './CplusplusGenerator';
import { ConstrainedMetaModel, InputMetaModel, Preset } from '../../models';
import { CplusplusDependencyManager } from './CplusplusDependencyManager';

/**
 * Common renderer for Cplusplus
 *
 * @extends AbstractRenderer
 */
export abstract class CplusplusRenderer<
  RendererModelType extends ConstrainedMetaModel
> extends AbstractRenderer<
  CplusplusOptions,
  CplusplusGenerator,
  RendererModelType
> {
  constructor(
    options: CplusplusOptions,
    generator: CplusplusGenerator,
    presets: Array<[Preset, unknown]>,
    model: RendererModelType,
    inputModel: InputMetaModel,
    public dependencyManager: CplusplusDependencyManager
  ) {
    super(options, generator, presets, model, inputModel);
  }
}
