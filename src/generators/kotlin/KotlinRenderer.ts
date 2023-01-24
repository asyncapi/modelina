import { AbstractRenderer } from '../AbstractRenderer';
import { KotlinGenerator, KotlinOptions } from './KotlinGenerator';
import { ConstrainedMetaModel, InputMetaModel, Preset } from '../../models';
import { FormatHelpers } from '../../helpers';
import { KotlinDependencyManager } from './KotlinDependencyManager';

/**
 * Common renderer for Kotlin
 *
 * @extends AbstractRenderer
 */
export abstract class KotlinRenderer<
  RendererModelType extends ConstrainedMetaModel
> extends AbstractRenderer<KotlinOptions, KotlinGenerator, RendererModelType> {
  constructor(
    options: KotlinOptions,
    generator: KotlinGenerator,
    presets: Array<[Preset, unknown]>,
    model: RendererModelType,
    inputModel: InputMetaModel,
    public dependencyManager: KotlinDependencyManager
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
    value?: any | Record<string, any>,
    prefix?: 'field:' | 'get:' | 'param:'
  ): string {
    const name = `@${!prefix ? '' : prefix}${FormatHelpers.upperFirst(
      annotationName
    )}`;

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
