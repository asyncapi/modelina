import {
  AbstractGenerator,
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import {RenderOutput, ConstrainedMetaModel, MetaModel, ConstrainedObjectModel, ConstrainedEnumModel, InputMetaModel} from '../../models';
import {constrainMetaModel, Constraints, split, TypeMapping} from '../../helpers';
import {DartPreset, DART_DEFAULT_PRESET} from './DartPreset';
import {ClassRenderer} from './renderers/ClassRenderer';
import {EnumRenderer} from './renderers/EnumRenderer';
import {isReservedDartKeyword} from './Constants';
import {Logger} from '../../';
import {FormatHelpers} from '../../helpers/FormatHelpers';
import { DartDefaultConstraints, DartDefaultTypeMapping } from './DartConstrainer';

export interface DartOptions extends CommonGeneratorOptions<DartPreset> {
  collectionType?: 'List' | 'Normal';
  typeMapping: TypeMapping<DartOptions>;
  constraints: Constraints;
}

export interface DartRenderCompleteModelOptions {
  packageName: string;
}

export class DartGenerator extends AbstractGenerator<DartOptions, DartRenderCompleteModelOptions> {
  static defaultOptions: DartOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: DART_DEFAULT_PRESET,
    collectionType: 'Normal',
    typeMapping: DartDefaultTypeMapping,
    constraints: DartDefaultConstraints
  };

  constructor(
    options: Partial<DartOptions> = DartGenerator.defaultOptions,
  ) {
    const realizedOptions = {...DartGenerator.defaultOptions, ...options};
    super('Dart', realizedOptions);
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
    return constrainMetaModel(
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
    Logger.warn(`Dart generator, cannot generate this type of model, ${model.name}`);
    return Promise.resolve(RenderOutput.toRenderOutput({result: '', renderedName: '', dependencies: []}));
  }

  /**
   * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
   *
   * For Dart you need to specify which package the model is placed under.
   *
   * @param model
   * @param inputModel
   * @param options used to render the full output
   */
  async renderCompleteModel(model: ConstrainedMetaModel, inputModel: InputMetaModel, options: DartRenderCompleteModelOptions): Promise<RenderOutput> {
    if (isReservedDartKeyword(options.packageName)) {
      throw new Error(`You cannot use reserved Dart keyword (${options.packageName}) as package name, please use another.`);
    }

    const outputModel = await this.render(model, inputModel);
    const modelDependencies = model.getNearestDependencies().map((dependencyModelName) => {
      return `import 'package:${options.packageName}/${FormatHelpers.snakeCase(dependencyModelName.name)}.dart';`;
    });
    const outputContent = `${modelDependencies.join('\n')}
      ${outputModel.dependencies.join('\n')}
      ${outputModel.result}`;
    return RenderOutput.toRenderOutput({
      result: outputContent,
      renderedName: outputModel.renderedName,
      dependencies: outputModel.dependencies
    });
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
