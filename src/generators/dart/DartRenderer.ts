import { AbstractRenderer } from '../AbstractRenderer';
import { DartGenerator, DartOptions } from './DartGenerator';
import { Preset, ConstrainedMetaModel, InputMetaModel } from '../../models';
import { FormatHelpers } from '../../helpers';
import { DartDependencyManager } from './DartDependencyManager';

/**
 * Common renderer for Dart types
 *
 * @extends AbstractRenderer
 */
export abstract class DartRenderer<
  RendererModelType extends ConstrainedMetaModel
> extends AbstractRenderer<DartOptions, DartGenerator, RendererModelType> {
  constructor(
    options: DartOptions,
    generator: DartGenerator,
    presets: Array<[Preset, unknown]>,
    model: RendererModelType,
    inputModel: InputMetaModel,
    public dependencyManager: DartDependencyManager
  ) {
    super(options, generator, presets, model, inputModel);
  }

  renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    const newLiteral = lines.map((line: string) => ` * ${line}`).join('\n');
    return `/**
${newLiteral}
 */`;
  }

  renderAnnotation(
    annotationName: string,
    value?: any | Record<string, any>
  ): string {
    const name = `@${FormatHelpers.upperFirst(annotationName)}`;
    let values = undefined;
    if (value !== undefined) {
      if (typeof value === 'object') {
        values = Object.entries(value || {})
          .map(([paramName, newValue]) => {
            if (paramName && newValue !== undefined) {
              return `${paramName}=${newValue}`;
            }
            return newValue;
          })
          .filter((v) => v !== undefined)
          .join(', ');
      } else {
        values = value;
      }
    }
    return values !== undefined ? `${name}(${values})` : name;
  }
}
