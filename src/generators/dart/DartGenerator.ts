import {
  AbstractGenerator,
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import {CommonModel, CommonInputModel, RenderOutput} from '../../models';
import {CommonNamingConvention, CommonNamingConventionImplementation, ModelKind, TypeHelpers} from '../../helpers';
import {DartPreset, DART_DEFAULT_PRESET} from './DartPreset';
import {ClassRenderer} from './renderers/ClassRenderer';
import {EnumRenderer} from './renderers/EnumRenderer';
import {isReservedDartKeyword} from './Constants';
import {Logger} from '../../';
import {snakeCase} from '../../utils/NameHelpers';

export interface DartOptions extends CommonGeneratorOptions<DartPreset> {
  collectionType?: 'List';
  namingConvention?: CommonNamingConvention;
}

export interface DartRenderCompleteModelOptions {
  packageName: string;
}

export class DartGenerator extends AbstractGenerator<DartOptions, DartRenderCompleteModelOptions> {
  static defaultOptions: DartOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: DART_DEFAULT_PRESET,
    collectionType: 'List',
    namingConvention: CommonNamingConventionImplementation
  };

  constructor(
    options: DartOptions = DartGenerator.defaultOptions,
  ) {
    super('Dart', DartGenerator.defaultOptions, options);
  }

  /**
   * Render a scattered model, where the source code and library and model dependencies are separated.
   *
   * @param model
   * @param inputModel
   */
  render(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const kind = TypeHelpers.extractKind(model);
    // We don't support union in Dart generator, however, if union is an object, we render it as a class.
    if (kind === ModelKind.OBJECT || (kind === ModelKind.UNION && model.type?.includes('object'))) {
      return this.renderClass(model, inputModel);
    } else if (kind === ModelKind.ENUM) {
      return this.renderEnum(model, inputModel);
    }
    Logger.warn(`Dart generator, cannot generate this type of model, ${model.$id}`);
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
  async renderCompleteModel(model: CommonModel, inputModel: CommonInputModel, options: DartRenderCompleteModelOptions): Promise<RenderOutput> {
    if (isReservedDartKeyword(options.packageName)) {
      throw new Error(`You cannot use reserved Dart keyword (${options.packageName}) as package name, please use another.`);
    }

    const outputModel = await this.render(model, inputModel);
    const modelDependencies = model.getNearestDependencies().map((dependencyModelName) => {
      const formattedDependencyModelName = this.options.namingConvention?.type ? this.options.namingConvention.type(dependencyModelName, {
        inputModel,
        model: inputModel.models[String(dependencyModelName)],
        reservedKeywordCallback: isReservedDartKeyword
      }) : dependencyModelName;
      return `import 'package:${options.packageName}/${snakeCase(formattedDependencyModelName)}.dart';`;
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

  async renderClass(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('class');
    const renderer = new ClassRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    const renderedName = snakeCase(renderer.nameType(model.$id, model));
    return RenderOutput.toRenderOutput({result, renderedName, dependencies: renderer.dependencies});
  }

  async renderEnum(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('enum');
    const renderer = new EnumRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    const renderedName = snakeCase(renderer.nameType(model.$id, model));
    return RenderOutput.toRenderOutput({result, renderedName, dependencies: renderer.dependencies});
  }
}
