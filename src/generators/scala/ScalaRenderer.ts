import { AbstractRenderer } from '../AbstractRenderer';
import { ScalaGenerator, ScalaOptions } from './ScalaGenerator';
import { ConstrainedMetaModel, InputMetaModel, Preset } from '../../models';
import { FormatHelpers } from '../../helpers';
import { ScalaDependencyManager } from './ScalaDependencyManager';

/**
 * Common renderer for Scala
 *
 * @extends AbstractRenderer
 */
export abstract class ScalaRenderer<
  RendererModelType extends ConstrainedMetaModel
> extends AbstractRenderer<ScalaOptions, ScalaGenerator, RendererModelType> {
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
    const name = `@${annotationName}`;

    if (value === undefined || value === null) {
      return name;
    }

    if (typeof value !== 'object') {
      return `${name}(${value})`;
    }

    const entries = Object.entries(value || {});

    if (entries.length === 0) {
      return name;
    }

    const values = concatenateEntries(entries);
    return `${name}(${values})`;
  }
}

function concatenateEntries(entries: [string, unknown][] = []): string {
  return entries
    .map(([paramName, newValue]) => {
      if (paramName && newValue !== undefined) {
        return `${paramName}=${newValue}`;
      }
      return newValue;
    })
    .filter((v) => v !== undefined)
    .join(', ');
}
