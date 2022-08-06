import {
  AbstractGenerator,
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import { OutputModel, InputMetaModel, RenderOutput, ConstrainedObjectModel, ConstrainedEnumModel, ConstrainedMetaModel, MetaModel, ConstrainedTupleModel, ConstrainedUnionModel, UnionModel } from '../../models';
import { constrainMetaModel, Constraints, IndentationTypes, split, TypeMapping } from '../../helpers';
import { RustPreset, RUST_DEFAULT_PRESET } from './RustPreset';
import { StructRenderer } from './renderers/StructRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { Logger } from '../../utils/LoggingInterface';
import { RustDefaultConstraints, RustDefaultTypeMapping } from './RustConstrainer';
import { TupleRenderer } from './renderers/TupleRenderer';
import { UnionRenderer } from './renderers/UnionRenderer';
import { PackageRenderer } from './renderers/PackageRenderer';
import { DeepPartial, mergePartialAndDefault } from '../../utils/Partials';

export interface RustOptions extends CommonGeneratorOptions<RustPreset> {
  typeMapping: TypeMapping<RustOptions>;
  constraints: Constraints
}

export enum RustPackageFeatures {
  json,
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
  packageFeatures: RustPackageFeatures[]
}

export interface RustRenderCompleteModelOptions {
  supportFiles: boolean
  package: RustPackageOptions
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

export class ConstrainedSupportFileModel extends ConstrainedMetaModel { }

/**
 * Generator for Rust
 */
export class RustGenerator extends AbstractGenerator<RustOptions, RustRenderCompleteModelOptions> {
  static defaultOptions: RustOptions = {
    ...defaultGeneratorOptions,
    defaultPreset: RUST_DEFAULT_PRESET,
    typeMapping: RustDefaultTypeMapping,
    constraints: RustDefaultConstraints,
    indentation: {
      type: IndentationTypes.SPACES,
      size: 4
    }
  };
  constructor(
    options?: DeepPartial<RustOptions>,
  ) {
    const realizedOptions = { ...RustGenerator.defaultOptions, ...options };

    super('Rust', realizedOptions);
  }

  splitMetaModel(model: MetaModel): MetaModel[] {
    //These are the models that we have separate renderers for
    const metaModelsToSplit = {
      splitEnum: true,
      splitObject: true,
      splitTuple: true,
      splitArray: false,
      splitUnion: true,
    };
    return split(model, metaModelsToSplit);
  }

  constrainToMetaModel(model: MetaModel): ConstrainedMetaModel {
    // How to constrain Union member names?
    if (model instanceof UnionModel) {
      model.union = model.union.map((v, idx) => {
        v.name += idx;
        return v;
      });
    }

    return constrainMetaModel<RustOptions>(
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
    } else if (model instanceof ConstrainedTupleModel) {
      return this.renderTuple(model, inputModel);
    } else if (model instanceof ConstrainedUnionModel) {
      return this.renderUnion(model, inputModel);
    }
    Logger.warn(`Rust generator, cannot generate this type of model, ${model.name}`);
    return Promise.resolve(RenderOutput.toRenderOutput({ result: '', renderedName: '', dependencies: [] }));
  }
  /**
   * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
   *
   * @param model
   * @param inputModel
   * @param options
   */
  async renderCompleteModel(model: ConstrainedMetaModel, inputModel: InputMetaModel, options: RustRenderCompleteModelOptions): Promise<RenderOutput> {
    Logger.debug('Generating complete models with options: ', options);
    const outputModel = await this.render(model, inputModel);
    const outputContent = outputModel.result;
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
  async renderTuple(model: ConstrainedTupleModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    const presets = this.getPresets('tuple');
    const renderer = new TupleRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({ result, renderedName: model.name, dependencies: renderer.dependencies });
  }

  async renderUnion(model: ConstrainedUnionModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    const presets = this.getPresets('union');
    const renderer = new UnionRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({ result, renderedName: model.name, dependencies: renderer.dependencies });
  }
  async renderManifest(model: ConstrainedMetaModel, inputModel: InputMetaModel, options: RustRenderCompleteModelOptions): Promise<RenderOutput> {
    const presets = this.getPresets('package');
    const renderer = new PackageRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runPreset('manifest', { packageOptions: options.package, inputModel });
    return RenderOutput.toRenderOutput({ result, renderedName: model.name, dependencies: renderer.dependencies });
  }
  async renderLib(model: ConstrainedMetaModel, inputModel: InputMetaModel, options: RustRenderCompleteModelOptions): Promise<RenderOutput> {
    const presets = this.getPresets('package');
    const renderer = new PackageRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runPreset('lib', { packageOptions: options.package, inputModel });
    return RenderOutput.toRenderOutput({ result, renderedName: model.name, dependencies: renderer.dependencies });
  }

  async generateCompleteSupport(input: Record<string, unknown> | InputMetaModel, options: RustRenderCompleteModelOptions): Promise<OutputModel[]> {
    const inputModel = await this.processInput(input);
    const manifestMetaModel = new ConstrainedSupportFileModel('Cargo.toml', inputModel, 'supportFile');
    const libMetaModel = new ConstrainedSupportFileModel('src/lib.rs', inputModel, 'supportFile');
    const manifestOutput = await this.renderManifest(manifestMetaModel, inputModel, options);
    const libOutput = await this.renderLib(libMetaModel, inputModel, options);

    return [
      OutputModel.toOutputModel({
        result: manifestOutput.result,
        modelName: manifestOutput.renderedName,
        dependencies: manifestOutput.dependencies,
        model: manifestMetaModel,
        inputModel
      }),
      OutputModel.toOutputModel({
        result: libOutput.result,
        modelName: libOutput.renderedName,
        dependencies: libOutput.dependencies,
        model: libMetaModel,
        inputModel
      })
    ];
  }
}
