import { AbstractRenderer } from '../AbstractRenderer';
import { TypeScriptGenerator, TypeScriptOptions } from './TypeScriptGenerator';
import { FormatHelpers } from '../../helpers';
import { ConstrainedMetaModel, InputMetaModel, Preset } from '../../models';
import { renderJavaScriptDependency } from '../../utils/DependencyHelper';

/**
 * Common renderer for TypeScript types
 * 
 * @extends AbstractRenderer
 */
export abstract class TypeScriptRenderer<RendererModelType extends ConstrainedMetaModel> extends AbstractRenderer<TypeScriptOptions, TypeScriptGenerator, RendererModelType> {
  constructor(
    options: TypeScriptOptions,
    generator: TypeScriptGenerator,
    presets: Array<[Preset, unknown]>,
    model: RendererModelType, 
    inputModel: InputMetaModel,
  ) {
    super(options, generator, presets, model, inputModel);
  }

  renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    const renderedLines = lines.map(line => ` * ${line}`).join('\n');
    return `/**
${renderedLines}
 */`;
  }

  /**
   * Simple helper function to render a dependency based on the module systme.
   * 
   * @param toImport 
   * @param fromModule 
   */
  renderDependency(toImport: string, fromModule: string): string {
    return renderJavaScriptDependency(toImport, fromModule, this.options.moduleSystem);
  }
}
