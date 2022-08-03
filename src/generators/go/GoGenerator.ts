import {
  AbstractGenerator,
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import { InputMetaModel, RenderOutput, ConstrainedObjectModel, ConstrainedEnumModel, ConstrainedMetaModel, MetaModel } from '../../models';
import { constrainMetaModel, Constraints, split, TypeMapping } from '../../helpers';
import { GoPreset, GO_DEFAULT_PRESET } from './GoPreset';
import { StructRenderer } from './renderers/StructRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { Logger } from '../../utils/LoggingInterface';
import { GoDefaultConstraints, GoDefaultTypeMapping } from './GoConstrainer';
import { DeepPartial, mergePartialAndDefault } from '../../utils/Partials';

export interface GoOptions extends CommonGeneratorOptions<GoPreset> {
  typeMapping: TypeMapping<GoOptions>;
  constraints: Constraints
}

export interface GoRenderCompleteModelOptions {
  packageName: string
}

/**
 * Generator for Go
 */
export class GoGenerator extends AbstractGenerator<GoOptions, GoRenderCompleteModelOptions> {
  static defaultOptions: GoOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: GO_DEFAULT_PRESET,
    typeMapping: GoDefaultTypeMapping,
    constraints: GoDefaultConstraints
  };

  constructor(
    options?: DeepPartial<GoOptions>,
  ) {
    const realizedOptions = mergePartialAndDefault(GoGenerator.defaultOptions, options) as GoOptions;
    super('Go', realizedOptions);
  }

  splitMetaModel(model: MetaModel): MetaModel[] {
    //These are the models that we have separate renderers for
    const metaModelsToSplit = {
      splitEnum: true, 
      splitObject: true
    };
    return split(model, metaModelsToSplit);
  }

  constrainToMetaModel(model: MetaModel): ConstrainedMetaModel {
    return constrainMetaModel<GoOptions>(
      this.options.typeMapping, 
      this.options.constraints, 
      {
        metaModel: model,
        options: this.options,
        constrainedName: '' //This is just a placeholder, it will be constrained within the function
      }
    );
  }

  render(model: ConstrainedMetaModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    if (model instanceof ConstrainedObjectModel) {
      return this.renderStruct(model, inputModel);
    } else if (model instanceof ConstrainedEnumModel) {
      return this.renderEnum(model, inputModel);
    } 
    Logger.warn(`Go generator, cannot generate this type of model, ${model.name}`);
    return Promise.resolve(RenderOutput.toRenderOutput({ result: '', renderedName: '', dependencies: [] }));
  }

  /**
   * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
   *
   * @param model
   * @param inputModel
   * @param options
   */
  async renderCompleteModel(model: ConstrainedMetaModel, inputModel: InputMetaModel, options: GoRenderCompleteModelOptions): Promise<RenderOutput> {
    const outputModel = await this.render(model, inputModel);
    let importCode = '';
    if (outputModel.dependencies.length > 0) {
      const dependencies = outputModel.dependencies.map((dependency) => { return `"${dependency}"`; }).join('\n');
      importCode = `import (  
  ${dependencies}
)`;
    }
    const outputContent = `
package ${options.packageName}
${importCode}
${outputModel.result}`;
    return RenderOutput.toRenderOutput({ result: outputContent, renderedName: outputModel.renderedName, dependencies: outputModel.dependencies });
  }

  async renderEnum(model: ConstrainedEnumModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    const presets = this.getPresets('enum');
    const renderer = new EnumRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({ result, renderedName: model.name, dependencies: renderer.dependencies });
  }

  async renderStruct(model: ConstrainedObjectModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    const presets = this.getPresets('struct');
    const renderer = new StructRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({ result, renderedName: model.name, dependencies: renderer.dependencies });
  }
}
