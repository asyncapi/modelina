import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import { ConstrainedEnumModel, ConstrainedMetaModel, ConstrainedObjectModel, InputMetaModel, MetaModel, OutputModel, RenderOutput } from '../../models';
import { constrainMetaModel, Constraints, split, TypeMapping, hasPreset } from '../../helpers';
import { TypeScriptPreset, TS_DEFAULT_PRESET } from './TypeScriptPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { InterfaceRenderer } from './renderers/InterfaceRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { TypeRenderer } from './renderers/TypeRenderer';
import { TypeScriptDefaultConstraints, TypeScriptDefaultTypeMapping } from './TypeScriptConstrainer';
import { DeepPartial, mergePartialAndDefault, renderJavaScriptDependency } from '../../utils';
import { TypeScriptDependencyManager } from './TypeScriptDependencyManager';

export interface TypeScriptOptions extends CommonGeneratorOptions<TypeScriptPreset, TypeScriptDependencyManager> {
  renderTypes: boolean;
  modelType: 'class' | 'interface';
  enumType: 'enum' | 'union';
  mapType: 'indexedObject' | 'map' | 'record';
  typeMapping: TypeMapping<TypeScriptOptions, TypeScriptDependencyManager>;
  constraints: Constraints;
  moduleSystem: 'ESM' | 'CJS';
}

export interface TypeScriptRenderCompleteModelOptions {
  exportType: 'default' | 'named';
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
    dependencyManagerFactory: undefined
  };
  
  static defaultCompleteModelOptions: TypeScriptRenderCompleteModelOptions = {
    exportType: 'default'
  };

  constructor(
    options?: DeepPartial<TypeScriptOptions>,
  ) {
    const realizedOptions = mergePartialAndDefault(TypeScriptGenerator.defaultOptions, options) as TypeScriptOptions;
    realizedOptions.dependencyManagerFactory = () => { return new TypeScriptDependencyManager(realizedOptions);};
    super('TypeScript', realizedOptions);
  }

  splitMetaModel(model: MetaModel): MetaModel[] {
    //These are the models that we have separate renderers for
    const metaModelsToSplit = {
      splitEnum: true, 
      splitObject: true
    };
    return split(model, metaModelsToSplit);
  }

  constrainToMetaModel(model: MetaModel, dependencyManager: TypeScriptDependencyManager): ConstrainedMetaModel {
    return constrainMetaModel<TypeScriptOptions, TypeScriptDependencyManager>(
      this.options.typeMapping, 
      this.options.constraints, 
      {
        metaModel: model,
        dependencyManager: dependencyManager,
        options: this.options,
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
    completeModelOptions: TypeScriptRenderCompleteModelOptions, 
    dependencyManager?: TypeScriptDependencyManager = this.options.dependencyManagerFactory!()): Promise<RenderOutput> {
    const outputModel = await this.render(model, inputModel, dependencyManager);
    const modelDependencies = model.getNearestDependencies();
    //Create the correct dependency imports
    const modelDependencyImports = modelDependencies.map((model) => {return dependencyManager.renderCompleteModelDependencies(model, completeModelOptions); ); });

    //Ensure we expose the model correctly, based on the module system and export type
    const cjsExport =
    this.options.exportType === 'default'
        ? `module.exports = ${outputModel.renderedName};`
        : `exports.${outputModel.renderedName} = ${outputModel.renderedName};`;
    const esmExport =
      exportType === 'default'
        ? `export default ${outputModel.renderedName};\n`
        : `export {${outputModel.renderedName}};`;

    const modelCode = `${outputModel.result}\n${this.options.moduleSystem === 'CJS' ? cjsExport : esmExport}`;

    const outputContent = `${[...modelDependencyImports, ...outputModel.dependencies].join('\n')}
${modelCode}`;

    return RenderOutput.toRenderOutput({ result: outputContent, renderedName: outputModel.renderedName, dependencies: outputModel.dependencies });
  }

  render(model: ConstrainedMetaModel, inputModel: InputMetaModel, dependencyManager: TypeScriptDependencyManager = this.options.dependencyManagerFactory!()): Promise<RenderOutput> {
    if (model instanceof ConstrainedObjectModel) {
      if (this.options.modelType === 'interface') {
        return this.renderInterface(model, inputModel, dependencyManager);
      }
      return this.renderClass(model, inputModel, dependencyManager);
    } else if (model instanceof ConstrainedEnumModel) {
      return this.renderEnum(model, inputModel, dependencyManager);
    } 
    return this.renderType(model, inputModel, dependencyManager);
  }

  async renderClass(model: ConstrainedObjectModel, inputModel: InputMetaModel, dependencyManager: TypeScriptDependencyManager = this.options.dependencyManagerFactory!()): Promise<RenderOutput> {
    const presets = this.getPresets('class'); 
    const renderer = new ClassRenderer(this.options, this, presets, model, inputModel, dependencyManager);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, renderedName: model.name, dependencies: dependencyManager.dependencies});
  }

  async renderInterface(model: ConstrainedObjectModel, inputModel: InputMetaModel, dependencyManager: TypeScriptDependencyManager = this.options.dependencyManagerFactory!()): Promise<RenderOutput> {
    const presets = this.getPresets('interface'); 
    const renderer = new InterfaceRenderer(this.options, this, presets, model, inputModel, dependencyManager);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, renderedName: model.name, dependencies: dependencyManager.dependencies});
  }

  async renderEnum(model: ConstrainedEnumModel, inputModel: InputMetaModel, dependencyManager: TypeScriptDependencyManager = this.options.dependencyManagerFactory!()): Promise<RenderOutput> {
    const presets = this.getPresets('enum'); 
    const renderer = new EnumRenderer(this.options, this, presets, model, inputModel, dependencyManager);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, renderedName: model.name, dependencies: dependencyManager.dependencies});
  }

  async renderType(model: ConstrainedMetaModel, inputModel: InputMetaModel, dependencyManager: TypeScriptDependencyManager = this.options.dependencyManagerFactory!()): Promise<RenderOutput> {
    const presets = this.getPresets('type'); 
    const renderer = new TypeRenderer(this.options, this, presets, model, inputModel, dependencyManager);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, renderedName: model.name, dependencies: dependencyManager.dependencies});
  }
}
