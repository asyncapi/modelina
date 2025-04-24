import { AbstractRenderer } from '../AbstractRenderer';
import { JavaGenerator, JavaOptions } from './JavaGenerator';
import { ConstrainedMetaModel, InputMetaModel, Preset } from '../../models';
import { FormatHelpers } from '../../helpers';
import { AbstractDependencyManager } from '../AbstractDependencyManager';

/**
 * Common renderer for Java types
 *
 * @extends AbstractRenderer
 */
export abstract class JavaRenderer<
  RendererModelType extends ConstrainedMetaModel
> extends AbstractRenderer<JavaOptions, JavaGenerator, RendererModelType> {
  constructor(
    options: JavaOptions,
    generator: JavaGenerator,
    presets: Array<[Preset, unknown]>,
    model: RendererModelType,
    inputModel: InputMetaModel,
    public dependencyManager: AbstractDependencyManager
  ) {
    super(options, generator, presets, model, inputModel);
  }

  renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    const newLiteral = lines.map((line) => ` * ${line}`).join('\n');
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

  static renderStringLiteral(value: string): string {
    const escaped = value
      .replace(/\\/g, '\\\\')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\f/g, '\\f')
      .replace(/"/g, '\\"');
    return `"${escaped}"`;
  }

  renderStringLiteral(value: string): string {
    return JavaRenderer.renderStringLiteral(value);
  }
}
