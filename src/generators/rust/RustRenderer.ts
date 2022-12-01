import { AbstractRenderer } from '../AbstractRenderer';
import { RustGenerator, RustOptions } from './RustGenerator';
import { InputMetaModel, Preset, ConstrainedMetaModel } from '../../models';
import { FormatHelpers } from '../../helpers/FormatHelpers';
import { deriveCopy, deriveHash, derivePartialEq, deriveEq, derivePartialOrd, deriveOrd } from './RustConstrainer';
/**
 * Common renderer for Rust types
 * 
 * @extends AbstractRenderer
 */
export abstract class RustRenderer<RendererModelType extends ConstrainedMetaModel> extends AbstractRenderer<RustOptions, RustGenerator, RendererModelType> {
  constructor(
    options: RustOptions,
    generator: RustGenerator,
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

  renderMacro(model: ConstrainedMetaModel): string {
    const derive: string[] = ['Clone', 'Debug'];
    if (deriveHash(model)) {
      derive.push('Hash');
    }
    if (deriveCopy(model)) {
      derive.push('Copy');
    }
    if (derivePartialEq(model)) {
      derive.push('PartialEq');
    }
    if (deriveEq(model)) {
      derive.push('Eq');
    }
    if (derivePartialOrd(model)) {
      derive.push('PartialOrd');
    }
    if (deriveOrd(model)) {
      derive.push('Ord');
    }
    derive.sort();
    return `#[derive(${derive.join(', ')})]`;
  }
}
