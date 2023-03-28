import {
  AbstractGenerator,
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import {
  OutputModel,
  InputMetaModel,
  RenderOutput,
  ConstrainedObjectModel,
  ConstrainedEnumModel,
  ConstrainedMetaModel,
  MetaModel,
  ConstrainedTupleModel,
  ConstrainedUnionModel
} from '../../models';
import {
  constrainMetaModel,
  Constraints,
  IndentationTypes,
  split,
  SplitOptions,
  TypeMapping
} from '../../helpers';
import { RustPreset, RUST_DEFAULT_PRESET } from './RustPreset';
import { StructRenderer } from './renderers/StructRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { Logger } from '../../utils/LoggingInterface';
import {
  RustDefaultConstraints,
  RustDefaultTypeMapping
} from './RustConstrainer';
import { TupleRenderer } from './renderers/TupleRenderer';
import { UnionRenderer } from './renderers/UnionRenderer';
import { PackageRenderer } from './renderers/PackageRenderer';
import { DeepPartial, mergePartialAndDefault } from '../../utils/Partials';
import { RustDependencyManager } from './RustDependencyManager';
export interface RustOptions extends CommonGeneratorOptions<RustPreset> {
  typeMapping: TypeMapping<RustOptions, RustDependencyManager>;
  constraints: Constraints;
}
export type RustTypeMapping = TypeMapping<RustOptions, RustDependencyManager>;

export enum RustPackageFeatures {
  json
}

export interface RustPackageOptions {
  packageName: string;
  packageVersion: string;
  authors: string[];
  homepage: string;
  repository: string;
  license: string;
  description: string;
  edition: string;
  packageFeatures: RustPackageFeatures[];
}

export interface RustRenderCompleteModelOptions {
  supportFiles: boolean;
  package: RustPackageOptions;
}

export const defaultRustRenderCompleteModelOptions = {
  supportFiles: true,
  package: {
    // Many of these options can be parsed from schema?
    packageName: 'asyncapi-rs-models',
    packageVersion: '0.0.0',
    authors: ['AsyncAPI Rust Champions'],
    homepage: 'https://www.asyncapi.com/tools/modelina',
    repository: 'https://github.com/asyncapi/modelina',
    license: 'Apache-2.0',
    description: 'Rust models generated by AsyncAPI Modelina',
    edition: '2018',
    packageFeatures: [RustPackageFeatures.json] as RustPackageFeatures[]
  } as RustPackageOptions
};

export class ConstrainedSupportFileModel extends ConstrainedMetaModel {}

/**
 * Generator for Rust
 */
export class RustGenerator extends AbstractGenerator<
  RustOptions,
  RustRenderCompleteModelOptions
> {
  static defaultOptions: RustOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: RUST_DEFAULT_PRESET,
    typeMapping: RustDefaultTypeMapping,
    constraints: RustDefaultConstraints,
    indentation: {
      type: IndentationTypes.SPACES,
      size: 4
    },
    // Temporarily set
    dependencyManager: () => {
      return {} as RustDependencyManager;
    }
  };

  constructor(options?: DeepPartial<RustOptions>) {
    const realizedOptions = RustGenerator.getRustOptions(options);
    super('Rust', realizedOptions);
  }

  /**
   * Returns the Rust options by merging custom options with default ones.
   */
  static getRustOptions(options?: DeepPartial<RustOptions>): RustOptions {
    const optionsToUse = mergePartialAndDefault(
      RustGenerator.defaultOptions,
      options
    ) as RustOptions;
    //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
    if (options?.dependencyManager === undefined) {
      optionsToUse.dependencyManager = () => {
        return new RustDependencyManager(optionsToUse);
      };
    }
    return optionsToUse;
  }

  /**
   * Returns the Rust options by merging custom options with default ones.
   */
  static getRustCompleteOptions(
    options?: DeepPartial<RustRenderCompleteModelOptions>
  ): RustRenderCompleteModelOptions {
    return mergePartialAndDefault(
      defaultRustRenderCompleteModelOptions,
      options
    ) as RustRenderCompleteModelOptions;
  }

  /**
   * Wrapper to get an instance of the dependency manager
   */
  getDependencyManager(options: RustOptions): RustDependencyManager {
    return this.getDependencyManagerInstance(options) as RustDependencyManager;
  }

  splitMetaModel(model: MetaModel): MetaModel[] {
    //These are the models that we have separate renderers for
    const metaModelsToSplit: SplitOptions = {
      splitEnum: true,
      splitObject: true,
      splitTuple: true,
      splitArray: false,
      splitUnion: true
    };
    return split(model, metaModelsToSplit);
  }

  constrainToMetaModel(
    model: MetaModel,
    options: DeepPartial<RustOptions>
  ): ConstrainedMetaModel {
    const optionsToUse = RustGenerator.getRustOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    return constrainMetaModel<RustOptions, RustDependencyManager>(
      this.options.typeMapping,
      this.options.constraints,
      {
        metaModel: model,
        dependencyManager: dependencyManagerToUse,
        options: this.options,
        constrainedName: '' //This is just a placeholder, it will be constrained within the function
      }
    );
  }

  render(
    model: ConstrainedMetaModel,
    inputModel: InputMetaModel,
    options?: DeepPartial<RustOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = RustGenerator.getRustOptions({
      ...this.options,
      ...options
    });
    if (model instanceof ConstrainedObjectModel) {
      return this.renderStruct(model, inputModel, optionsToUse);
    } else if (model instanceof ConstrainedEnumModel) {
      return this.renderEnum(model, inputModel, optionsToUse);
    } else if (model instanceof ConstrainedTupleModel) {
      return this.renderTuple(model, inputModel, optionsToUse);
    } else if (model instanceof ConstrainedUnionModel) {
      return this.renderUnion(model, inputModel, optionsToUse);
    }
    Logger.warn(
      `Rust generator, cannot generate this type of model, ${model.name}`
    );
    return Promise.resolve(
      RenderOutput.toRenderOutput({
        result: '',
        renderedName: '',
        dependencies: []
      })
    );
  }

  /**
   * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
   *
   * @param model
   * @param inputModel
   * @param options
   */
  async renderCompleteModel(
    model: ConstrainedMetaModel,
    inputModel: InputMetaModel,
    _completeModelOptions: Partial<RustRenderCompleteModelOptions>,
    options: DeepPartial<RustOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = RustGenerator.getRustOptions({
      ...this.options,
      ...options
    });
    Logger.debug('Generating complete models with options: ', optionsToUse);
    const outputModel = await this.render(model, inputModel);
    const outputContent = outputModel.result;
    return RenderOutput.toRenderOutput({
      result: outputContent,
      renderedName: outputModel.renderedName,
      dependencies: outputModel.dependencies
    });
  }

  async renderEnum(
    model: ConstrainedEnumModel,
    inputModel: InputMetaModel,
    options?: DeepPartial<RustOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = RustGenerator.getRustOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    const presets = this.getPresets('enum');
    const renderer = new EnumRenderer(
      optionsToUse,
      this,
      presets,
      model,
      inputModel,
      dependencyManagerToUse
    );
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({
      result,
      renderedName: model.name,
      dependencies: dependencyManagerToUse.dependencies
    });
  }

  async renderStruct(
    model: ConstrainedObjectModel,
    inputModel: InputMetaModel,
    options?: DeepPartial<RustOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = RustGenerator.getRustOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    const presets = this.getPresets('struct');
    const renderer = new StructRenderer(
      optionsToUse,
      this,
      presets,
      model,
      inputModel,
      dependencyManagerToUse
    );
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({
      result,
      renderedName: model.name,
      dependencies: dependencyManagerToUse.dependencies
    });
  }

  async renderTuple(
    model: ConstrainedTupleModel,
    inputModel: InputMetaModel,
    options?: DeepPartial<RustOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = RustGenerator.getRustOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    const presets = this.getPresets('tuple');
    const renderer = new TupleRenderer(
      optionsToUse,
      this,
      presets,
      model,
      inputModel,
      dependencyManagerToUse
    );
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({
      result,
      renderedName: model.name,
      dependencies: dependencyManagerToUse.dependencies
    });
  }

  async renderUnion(
    model: ConstrainedUnionModel,
    inputModel: InputMetaModel,
    options?: DeepPartial<RustOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = RustGenerator.getRustOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    const presets = this.getPresets('union');
    const renderer = new UnionRenderer(
      optionsToUse,
      this,
      presets,
      model,
      inputModel,
      dependencyManagerToUse
    );
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({
      result,
      renderedName: model.name,
      dependencies: dependencyManagerToUse.dependencies
    });
  }
  async renderManifest(
    model: ConstrainedMetaModel,
    inputModel: InputMetaModel,
    completeModelOptions: Partial<RustRenderCompleteModelOptions>,
    options?: DeepPartial<RustOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = RustGenerator.getRustOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    const presets = this.getPresets('package');
    const renderer = new PackageRenderer(
      optionsToUse,
      this,
      presets,
      model,
      inputModel,
      dependencyManagerToUse
    );
    const result = await renderer.runPreset('manifest', {
      packageOptions: completeModelOptions.package,
      inputModel
    });
    return RenderOutput.toRenderOutput({
      result,
      renderedName: model.name,
      dependencies: dependencyManagerToUse.dependencies
    });
  }
  async renderLib(
    model: ConstrainedMetaModel,
    inputModel: InputMetaModel,
    completeModelOptions: Partial<RustRenderCompleteModelOptions>,
    options?: DeepPartial<RustOptions>
  ): Promise<RenderOutput> {
    const optionsToUse = RustGenerator.getRustOptions({
      ...this.options,
      ...options
    });
    const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
    const presets = this.getPresets('package');
    const renderer = new PackageRenderer(
      optionsToUse,
      this,
      presets,
      model,
      inputModel,
      dependencyManagerToUse
    );
    const result = await renderer.runPreset('lib', {
      packageOptions: completeModelOptions.package,
      inputModel
    });
    return RenderOutput.toRenderOutput({
      result,
      renderedName: model.name,
      dependencies: dependencyManagerToUse.dependencies
    });
  }

  async generateCompleteSupport(
    input: Record<string, unknown> | InputMetaModel,
    completeModelOptions: Partial<RustRenderCompleteModelOptions>,
    options?: DeepPartial<RustOptions>
  ): Promise<OutputModel[]> {
    const inputModel = await this.processInput(input);
    const manifestMetaModel = new ConstrainedSupportFileModel(
      'Cargo.toml',
      inputModel,
      {},
      'supportFile'
    );
    const libMetaModel = new ConstrainedSupportFileModel(
      'src/lib.rs',
      inputModel,
      {},
      'supportFile'
    );
    const manifestOutput = await this.renderManifest(
      manifestMetaModel,
      inputModel,
      completeModelOptions,
      options
    );
    const libOutput = await this.renderLib(
      libMetaModel,
      inputModel,
      completeModelOptions,
      options
    );

    return [
      OutputModel.toOutputModel({
        result: manifestOutput.result,
        modelName: 'CargoToml',
        dependencies: manifestOutput.dependencies,
        model: manifestMetaModel,
        inputModel
      }),
      OutputModel.toOutputModel({
        result: libOutput.result,
        modelName: 'lib',
        dependencies: libOutput.dependencies,
        model: libMetaModel,
        inputModel
      })
    ];
  }
}
