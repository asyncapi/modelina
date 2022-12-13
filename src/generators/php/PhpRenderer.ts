import { AbstractRenderer } from '../AbstractRenderer';
import { PhpGenerator, PhpOptions } from './PhpGenerator';
import { ConstrainedMetaModel, InputMetaModel, Preset } from '../../models';
import {FormatHelpers} from "../../helpers";

/**
 * Common renderer for Php
 * 
 * @extends AbstractRenderer
 */
export abstract class PhpRenderer<RendererModelType extends ConstrainedMetaModel> extends AbstractRenderer<PhpOptions, PhpGenerator, RendererModelType> {
  constructor(
    options: PhpOptions,
    generator: PhpGenerator,
    presets: Array<[Preset, unknown]>,
    model: RendererModelType, 
    inputModel: InputMetaModel,
  ) {
    super(options, generator, presets, model, inputModel);
  }

  renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    const content = lines.map(line => ` * ${line}`).join('\n');
    return `/**
${content}
 */`;
  }
}
