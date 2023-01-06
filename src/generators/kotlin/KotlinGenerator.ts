import {
  AbstractGenerator,
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import { ConstrainedEnumModel, ConstrainedMetaModel, ConstrainedObjectModel, InputMetaModel, MetaModel, RenderOutput } from '../../models';
import {IndentationTypes, split, TypeMapping} from '../../helpers';
import { KotlinPreset, KOTLIN_DEFAULT_PRESET } from './KotlinPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { isReservedKotlinKeyword } from './Constants';
import { Logger } from '../..';
import { constrainMetaModel, Constraints } from '../../helpers/ConstrainHelpers';
import { KotlinDefaultConstraints, KotlinDefaultTypeMapping } from './KotlinConstrainer';
import { DeepPartial, mergePartialAndDefault } from '../../utils/Partials';

export interface KotlinOptions extends CommonGeneratorOptions<KotlinPreset> {
  typeMapping: TypeMapping<KotlinOptions>;
  constraints: Constraints;
  collectionType: 'List' | 'Array';
}
export interface KotlinRenderCompleteModelOptions {
  packageName: string
}
export class KotlinGenerator extends AbstractGenerator<KotlinOptions, KotlinRenderCompleteModelOptions> {
  static defaultOptions: KotlinOptions = {
    ...defaultGeneratorOptions,
    indentation: {
      type: IndentationTypes.SPACES,
      size: 4,
    },
    defaultPreset: KOTLIN_DEFAULT_PRESET,
    collectionType: 'List',
    typeMapping: KotlinDefaultTypeMapping,
    constraints: KotlinDefaultConstraints
  };

  constructor(
    options?: DeepPartial<KotlinOptions>,
  ) {
    const realizedOptions = mergePartialAndDefault(KotlinGenerator.defaultOptions, options) as KotlinOptions;
    super('Kotlin', realizedOptions);
  }
  /**
   * This function makes sure we split up the MetaModels accordingly to what we want to render as models.
   */
  splitMetaModel(model: MetaModel): MetaModel[] {
    const metaModelsToSplit = {
      splitEnum: true,
      splitObject: true
    };
    return split(model, metaModelsToSplit);
  }

  constrainToMetaModel(model: MetaModel): ConstrainedMetaModel {
    return constrainMetaModel<KotlinOptions>(
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
   * Render a scattered model, where the source code and library and model dependencies are separated.
   *
   * @param model
   * @param inputModel
   */
  render(model: ConstrainedMetaModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    if (model instanceof ConstrainedObjectModel) {
      return this.renderClass(model, inputModel);
    } else if (model instanceof ConstrainedEnumModel) {
      return this.renderEnum(model, inputModel);
    }
    Logger.warn(`Kotlin generator, cannot generate this type of model, ${model.name}`);
    return Promise.resolve(RenderOutput.toRenderOutput({ result: '', renderedName: '', dependencies: [] }));
  }

  /**
   * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
   *
   * For Kotlin you need to specify which package the model is placed under.
   *
   * @param model
   * @param inputModel
   * @param options used to render the full output
   */
  async renderCompleteModel(model: ConstrainedMetaModel, inputModel: InputMetaModel, options: KotlinRenderCompleteModelOptions): Promise<RenderOutput> {
    const outputModel = await this.render(model, inputModel);

    const packageName = this.sanitizePackageName(options.packageName);
    const outputContent = `package ${packageName}
${outputModel.dependencies.join('\n')}
${outputModel.result}`;
    return RenderOutput.toRenderOutput({result: outputContent, renderedName: outputModel.renderedName, dependencies: outputModel.dependencies});
  }

  private sanitizePackageName(packageName: string): string {
    return packageName
      .split('.')
      .map(subpackage => isReservedKotlinKeyword(subpackage, true) ? `\`${subpackage}\`` : subpackage)
      .join('.');
  }

  async renderClass(model: ConstrainedObjectModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    const presets = this.getPresets('class');
    const renderer = new ClassRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, renderedName: model.name, dependencies: renderer.dependencies});
  }

  async renderEnum(model: ConstrainedEnumModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    const presets = this.getPresets('enum');
    const renderer = new EnumRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, renderedName: model.name, dependencies: renderer.dependencies});
  }
}
