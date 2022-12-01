import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import { ConstrainedEnumModel, ConstrainedMetaModel, ConstrainedObjectModel, InputMetaModel, MetaModel, RenderOutput } from '../../models';
import { constrainMetaModel, Constraints, hasPreset, split, TypeMapping } from '../../helpers';
import { TypeScriptPreset, TS_DEFAULT_PRESET } from './TypeScriptPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { InterfaceRenderer } from './renderers/InterfaceRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { TypeRenderer } from './renderers/TypeRenderer';
import { TypeScriptDefaultConstraints, TypeScriptDefaultTypeMapping } from './TypeScriptConstrainer';
import { DeepPartial, mergePartialAndDefault } from '../../utils';
import { TypeScriptDependencyManager } from './TypeScriptDependencyManager';
import { TS_EXPORT_KEYWORD_PRESET } from './presets/ExportKeywordPreset';

export type TypeScriptModuleSystemType = 'ESM' | 'CJS';
export type TypeScriptExportType = 'named' | 'default';
export interface TypeScriptOptions extends CommonGeneratorOptions<TypeScriptPreset, TypeScriptDependencyManager> {
  renderTypes: boolean;
  modelType: 'class' | 'interface';
  enumType: 'enum' | 'union';
  mapType: 'indexedObject' | 'map' | 'record';
  typeMapping: TypeMapping<TypeScriptOptions, TypeScriptDependencyManager>;
  constraints: Constraints;
  moduleSystem: TypeScriptModuleSystemType;
}
export type TypeScriptTypeMapping = TypeMapping<TypeScriptOptions, TypeScriptDependencyManager>;
export interface TypeScriptRenderCompleteModelOptions {
  exportType: TypeScriptExportType;
}

/**
 * Generator for TypeScript
 */
export class TypeScriptGenerator extends AbstractGenerator<TypeScriptOptions, TypeScriptRenderCompleteModelOptions> {
  static defaultOptions: TypeScriptOptions = {
    ...defaultGeneratorOptions,
    renderTypes: true,
    modelType: 'class',
    enumType: 'enum',
    mapType: 'map',
    defaultPreset: TS_DEFAULT_PRESET,
    typeMapping: TypeScriptDefaultTypeMapping,
    constraints: TypeScriptDefaultConstraints,
    moduleSystem: 'ESM',
    //Temporarily sat
    dependencyManager: () => { return {} as TypeScriptDependencyManager;}
  };
  
  static defaultCompleteModelOptions: TypeScriptRenderCompleteModelOptions = {
    exportType: 'default'
  };

  constructor(
    options?: DeepPartial<TypeScriptOptions>,
  ) {
    const realizedOptions = TypeScriptGenerator.getTypeScriptOptions(options);
    super('TypeScript', realizedOptions);
  }

  /**
   * Returns the TypeScript options by merging custom options with default ones.
   */
  static getTypeScriptOptions(options?: DeepPartial<TypeScriptOptions>): TypeScriptOptions {
    const optionsToUse = mergePartialAndDefault(TypeScriptGenerator.defaultOptions, options) as TypeScriptOptions;
    //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
    if (options?.dependencyManager === undefined) {
      optionsToUse.dependencyManager = () => { return new TypeScriptDependencyManager(optionsToUse); };
    }
    return optionsToUse;
  }

  /**
   * Wrapper to get an instance of the dependency manager
   */
  getTypeScriptDependencyManager(options: TypeScriptOptions): TypeScriptDependencyManager {
    return this.getDependencyManagerInstance(options) as TypeScriptDependencyManager;
  }

  splitMetaModel(model: MetaModel): MetaModel[] {
    //These are the models that we have separate renderers for
    const metaModelsToSplit = {
      splitEnum: true, 
      splitObject: true
    };
    return split(model, metaModelsToSplit);
  }

  constrainToMetaModel(model: MetaModel, options: DeepPartial<TypeScriptOptions>): ConstrainedMetaModel {
    const optionsToUse = TypeScriptGenerator.getTypeScriptOptions({...this.options, ...options});
    const dependencyManagerToUse = this.getTypeScriptDependencyManager(optionsToUse);
    return constrainMetaModel<TypeScriptOptions, TypeScriptDependencyManager>(
      this.options.typeMapping, 
      this.options.constraints, 
      {
        metaModel: model,
        dependencyManager: dependencyManagerToUse,
        options: {...this.options},
        constrainedName: '' //This is just a placeholder, it will be constrained within the function
      }
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
    completeModelOptions: Partial<TypeScriptRenderCompleteModelOptions>,
    options: DeepPartial<TypeScriptOptions>): Promise<RenderOutput> {
    const completeModelOptionsToUse = mergePartialAndDefault(TypeScriptGenerator.defaultCompleteModelOptions, completeModelOptions) as TypeScriptRenderCompleteModelOptions;
    const optionsToUse = TypeScriptGenerator.getTypeScriptOptions({...this.options, ...options});
    const dependencyManagerToUse = this.getTypeScriptDependencyManager(optionsToUse);
    const outputModel = await this.render(model, inputModel, {dependencyManager: dependencyManagerToUse});
    const modelDependencies = model.getNearestDependencies();
    // Shallow copy presets so that we can restore it once we are done
    const originalPresets = [...(this.options.presets ? this.options.presets : [])];

    // Add preset that adds the `export` keyword if it hasn't already been added
    if (
      this.options.moduleSystem === 'ESM' &&
      completeModelOptionsToUse.exportType === 'named' &&
      !hasPreset(originalPresets, TS_EXPORT_KEYWORD_PRESET)
    ) {
      this.options.presets = [TS_EXPORT_KEYWORD_PRESET, ...originalPresets];
    }
    //Create the correct model dependency imports
    const modelDependencyImports = modelDependencies.map((model) => {
      return dependencyManagerToUse.renderCompleteModelDependencies(model, completeModelOptionsToUse.exportType); 
    });
    const modelExport = dependencyManagerToUse.renderCompleteModelDependencies(model, completeModelOptionsToUse.exportType);

    const modelCode = `${outputModel.result}\n${modelExport}`;

    const outputContent = `${[...modelDependencyImports, ...outputModel.dependencies].join('\n')}
${modelCode}`;

    return RenderOutput.toRenderOutput({ result: outputContent, renderedName: outputModel.renderedName, dependencies: outputModel.dependencies });
  }

  /**
   * Render any ConstrainedMetaModel to code based on the type
   */
  render(model: ConstrainedMetaModel, inputModel: InputMetaModel, options?: DeepPartial<TypeScriptOptions>): Promise<RenderOutput> {
    const optionsToUse = TypeScriptGenerator.getTypeScriptOptions({...this.options, ...options});
    if (model instanceof ConstrainedObjectModel) {
      if (this.options.modelType === 'interface') {
        return this.renderInterface(model, inputModel, optionsToUse);
      }
      return this.renderClass(model, inputModel, optionsToUse);
    } else if (model instanceof ConstrainedEnumModel) {
      return this.renderEnum(model, inputModel, optionsToUse);
    } 
    return this.renderType(model, inputModel, optionsToUse);
  }

  async renderClass(model: ConstrainedObjectModel, inputModel: InputMetaModel, options?: DeepPartial<TypeScriptOptions>): Promise<RenderOutput> {
    const optionsToUse = TypeScriptGenerator.getTypeScriptOptions({...this.options, ...options});
    const dependencyManagerToUse = this.getTypeScriptDependencyManager(optionsToUse);
    const presets = this.getPresets('class');
    const renderer = new ClassRenderer(optionsToUse, this, presets, model, inputModel, dependencyManagerToUse);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, renderedName: model.name, dependencies: dependencyManagerToUse.dependencies});
  }

  async renderInterface(model: ConstrainedObjectModel, inputModel: InputMetaModel, options?: Partial<TypeScriptOptions>): Promise<RenderOutput> {
    const optionsToUse = TypeScriptGenerator.getTypeScriptOptions({...this.options, ...options});
    const dependencyManagerToUse = this.getTypeScriptDependencyManager(optionsToUse);
    const presets = this.getPresets('interface'); 
    const renderer = new InterfaceRenderer(optionsToUse, this, presets, model, inputModel, dependencyManagerToUse);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, renderedName: model.name, dependencies: dependencyManagerToUse.dependencies});
  }

  async renderEnum(model: ConstrainedEnumModel, inputModel: InputMetaModel, options?: DeepPartial<TypeScriptOptions>): Promise<RenderOutput> {
    const optionsToUse = TypeScriptGenerator.getTypeScriptOptions({...this.options, ...options});
    const dependencyManagerToUse = this.getTypeScriptDependencyManager(optionsToUse);
    const presets = this.getPresets('enum'); 
    const renderer = new EnumRenderer(optionsToUse, this, presets, model, inputModel, dependencyManagerToUse);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, renderedName: model.name, dependencies: dependencyManagerToUse.dependencies});
  }

  async renderType(model: ConstrainedMetaModel, inputModel: InputMetaModel, options?: DeepPartial<TypeScriptOptions>): Promise<RenderOutput> {
    const optionsToUse = TypeScriptGenerator.getTypeScriptOptions({...this.options, ...options});
    const dependencyManagerToUse = this.getTypeScriptDependencyManager(optionsToUse);
    const presets = this.getPresets('type'); 
    const renderer = new TypeRenderer(optionsToUse, this, presets, model, inputModel, dependencyManagerToUse);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, renderedName: model.name, dependencies: dependencyManagerToUse.dependencies});
  }
}
