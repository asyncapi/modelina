import {
  AbstractGenerator,
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import { CommonModel, CommonInputModel, RenderOutput } from '../../models';
import { TypeHelpers, ModelKind, CommonNamingConvention, CommonNamingConventionImplementation } from '../../helpers';
import { CSharpPreset, CSHARP_DEFAULT_PRESET } from './CSharpPreset';
import { EnumRenderer } from './renderers/EnumRenderer';
import { ClassRenderer } from './renderers/ClassRenderer';
import { isReservedCSharpKeyword } from './Constants';
import { Logger } from '../../index';

export interface CSharpOptions extends CommonGeneratorOptions<CSharpPreset> {
  collectionType?: 'List' | 'Array';
  namingConvention?: CommonNamingConvention;
}

export interface CSharpRenderCompleteModelOptions {
  namespace: string
}

/**
 * Generator for CSharp
 */
export class CSharpGenerator extends AbstractGenerator<CSharpOptions, CSharpRenderCompleteModelOptions> {
  static defaultOptions: CSharpOptions = {
    ...defaultGeneratorOptions,
    collectionType: 'List',
    defaultPreset: CSHARP_DEFAULT_PRESET,
    namingConvention: CommonNamingConventionImplementation
  };

  constructor(
    options: CSharpOptions = CSharpGenerator.defaultOptions,
  ) {
    super('CSharp', CSharpGenerator.defaultOptions, options);
  }

  /**
   * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
   * 
   * For CSharp we need to specify which namespace the model is placed under.
   * 
   * @param model 
   * @param inputModel 
   * @param options used to render the full output
   */
  async renderCompleteModel(model: CommonModel, inputModel: CommonInputModel, options: CSharpRenderCompleteModelOptions): Promise<RenderOutput> {
    if (isReservedCSharpKeyword(options.namespace)) {
      throw new Error(`You cannot use reserved CSharp keyword (${options.namespace}) as namespace, please use another.`);
    }

    const outputModel = await this.render(model, inputModel);
    const outputContent = `namespace ${options.namespace}
{
  ${outputModel.dependencies.join('\n')}
  ${outputModel.result}
}`;
    
    return RenderOutput.toRenderOutput({result: outputContent, renderedName: outputModel.renderedName, dependencies: outputModel.dependencies});
  }

  render(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const kind = TypeHelpers.extractKind(model);
    switch (kind) {
    case ModelKind.UNION:
      //We dont support union in Csharp generator, however, if union is an object, we render it as a class.
      if (!model.type?.includes('object')) {break;}
      return this.renderClass(model, inputModel);
    case ModelKind.OBJECT: 
      return this.renderClass(model, inputModel);
    case ModelKind.ENUM: 
      return this.renderEnum(model, inputModel);
    }
    Logger.warn(`C# generator, cannot generate this type of model, ${model.$id}`);
    return Promise.resolve(RenderOutput.toRenderOutput({ result: '', renderedName: '', dependencies: [] }));
  }

  async renderEnum(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('enum');
    const renderer = new EnumRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    const renderedName = renderer.nameType(model.$id, model);
    return RenderOutput.toRenderOutput({ result, renderedName, dependencies: renderer.dependencies });
  }

  async renderClass(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('class');
    const renderer = new ClassRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    const renderedName = renderer.nameType(model.$id, model);
    return RenderOutput.toRenderOutput({ result, renderedName, dependencies: renderer.dependencies });
  }
}
