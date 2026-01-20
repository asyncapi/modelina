import { AbstractRenderer } from '../AbstractRenderer';
import { RustGenerator, RustOptions } from './RustGenerator';
import { InputMetaModel, Preset, ConstrainedMetaModel } from '../../models';
import { FormatHelpers } from '../../helpers/FormatHelpers';
import {
  deriveCopy,
  deriveHash,
  deriveEq,
  derivePartialOrd,
  deriveOrd
} from './RustConstrainer';
import { RustDependencyManager } from './RustDependencyManager';

/**
 * Common renderer for Rust types
 *
 * @extends AbstractRenderer
 */
export abstract class RustRenderer<
  RendererModelType extends ConstrainedMetaModel
> extends AbstractRenderer<RustOptions, RustGenerator, RendererModelType> {
  constructor(
    options: RustOptions,
    generator: RustGenerator,
    presets: Array<[Preset, unknown]>,
    model: RendererModelType,
    inputModel: InputMetaModel,
    public dependencyManager: RustDependencyManager
  ) {
    super(options, generator, presets, model, inputModel);
  }

  renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    return lines.map((line) => `// ${line}`).join('\n');
  }

  renderMacro(model: ConstrainedMetaModel): string {
    const derive: string[] = [
      'Serialize',
      'Deserialize',
      'Clone',
      'Debug',
      'PartialEq'
    ];

    if (deriveHash(model)) {
      derive.push('Hash');
    }
    if (deriveCopy(model)) {
      derive.push('Copy');
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
