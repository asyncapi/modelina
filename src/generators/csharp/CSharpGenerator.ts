import {
  AbstractGenerator,
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import { ConstrainedEnumModel, ConstrainedMetaModel, ConstrainedObjectModel, InputMetaModel, MetaModel, RenderOutput } from '../../models';
import { FormatHelpers, TypeMapping, Constraints, constrainMetaModel, split } from '../../helpers';
import { CSharpPreset, CSHARP_DEFAULT_PRESET } from './CSharpPreset';
import { EnumRenderer } from './renderers/EnumRenderer';
import { ClassRenderer } from './renderers/ClassRenderer';
import { isReservedCSharpKeyword } from './Constants';
import { Logger } from '../../index';
import { CSharpDefaultConstraints, CSharpDefaultTypeMapping } from './CSharpConstrainer';

export interface CSharpOptions extends CommonGeneratorOptions<CSharpPreset> {
  collectionType?: 'List' | 'Array';
  typeMapping: TypeMapping<CSharpOptions>;
  constraints: Constraints;
  autoImplementedProperties: boolean;
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
    collectionType: 'Array',
    defaultPreset: CSHARP_DEFAULT_PRESET,
    typeMapping: CSharpDefaultTypeMapping,
    constraints: CSharpDefaultConstraints,
    autoImplementedProperties: false
  };

  constructor(
    options: Partial<CSharpOptions> = CSharpGenerator.defaultOptions,
  ) {
    const realizedOptions = {...CSharpGenerator.defaultOptions, ...options};

    super('CSharp', realizedOptions);
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
    return constrainMetaModel<CSharpOptions>(
      this.options.typeMapping, 
      this.options.constraints, 
      {
        metaModel: model,
        options: this.options,
        constrainedName: '' //This is just a placeholder, it will be constrained within the function
      }
    );
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
  async renderCompleteModel(model: ConstrainedMetaModel, inputModel: InputMetaModel, options: CSharpRenderCompleteModelOptions): Promise<RenderOutput> {
    if (isReservedCSharpKeyword(options.namespace)) {
      throw new Error(`You cannot use reserved CSharp keyword (${options.namespace}) as namespace, please use another.`);
    }

    const outputModel = await this.render(model, inputModel);

    const outputDependencies = outputModel.dependencies.length === 0 ? '' : `${outputModel.dependencies.join('\n')}\n\n`;

    const outputContent = `namespace ${options.namespace}
{
${FormatHelpers.indent(outputDependencies + outputModel.result, this.options.indentation?.size, this.options.indentation?.type)}
}`;

    return RenderOutput.toRenderOutput({ result: outputContent, renderedName: outputModel.renderedName, dependencies: outputModel.dependencies });
  }

  render(model: ConstrainedMetaModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    if (model instanceof ConstrainedObjectModel) {
      return this.renderClass(model, inputModel);
    } else if (model instanceof ConstrainedEnumModel) {
      return this.renderEnum(model, inputModel);
    } 
    Logger.warn(`C# generator, cannot generate this type of model, ${model.name}`);
    return Promise.resolve(RenderOutput.toRenderOutput({ result: '', renderedName: '', dependencies: [] }));
  }

  async renderEnum(model: ConstrainedEnumModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    const presets = this.getPresets('enum');
    const renderer = new EnumRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({ result, renderedName: model.name, dependencies: renderer.dependencies });
  }

  async renderClass(model: ConstrainedObjectModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    const presets = this.getPresets('class');
    const renderer = new ClassRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({ result, renderedName: model.name, dependencies: renderer.dependencies });
  }
}
