import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import { ConstrainedEnumModel, ConstrainedMetaModel, ConstrainedObjectModel, InputMetaModel, MetaModel, RenderOutput } from '../../models';
import { constrainMetaModel, Constraints, split, TypeMapping, hasPreset, SplitOptions, renderJavaScriptDependency } from '../../helpers';
import { TypeScriptPreset, TS_DEFAULT_PRESET } from './TypeScriptPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { InterfaceRenderer } from './renderers/InterfaceRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { TypeRenderer } from './renderers/TypeRenderer';
import { TypeScriptDefaultConstraints, TypeScriptDefaultTypeMapping } from './TypeScriptConstrainer';
import { TS_EXPORT_KEYWORD_PRESET } from './presets';
import { DeepPartial, mergePartialAndDefault } from '../../utils';

export interface TypeScriptOptions extends CommonGeneratorOptions<TypeScriptPreset> {
  renderTypes: boolean;
  modelType: 'class' | 'interface';
  enumType: 'enum' | 'union';
  mapType: 'indexedObject' | 'map' | 'record';
  typeMapping: TypeMapping<TypeScriptOptions>;
  constraints: Constraints;
  moduleSystem: 'ESM' | 'CJS';
  extendInterfaceWithAdditionalProperties: boolean;
}

export interface TypeScriptRenderCompleteModelOptions {
  exportType?: 'default' | 'named';
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
    extendInterfaceWithAdditionalProperties: true
  };

  constructor(
    options?: DeepPartial<TypeScriptOptions>,
  ) {
    const realizedOptions = mergePartialAndDefault(TypeScriptGenerator.defaultOptions, options) as TypeScriptOptions;
    super('TypeScript', realizedOptions);
  }

  splitMetaModel(model: MetaModel): MetaModel[] {
    //These are the models that we have separate renderers for
    const metaModelsToSplit: SplitOptions = {
      splitEnum: true, 
      splitObject: true
    };
    return split(model, metaModelsToSplit);
  }

  constrainToMetaModel(model: MetaModel): ConstrainedMetaModel {
    return constrainMetaModel<TypeScriptOptions>(
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
   * @param model
   * @param inputModel
   * @param options
   */
  async renderCompleteModel(model: ConstrainedMetaModel, inputModel: InputMetaModel, {exportType = 'default'}: TypeScriptRenderCompleteModelOptions): Promise<RenderOutput> {
    // Shallow copy presets so that we can restore it once we are done
    const originalPresets = [...(this.options.presets ? this.options.presets : [])];

    // Add preset that adds the `export` keyword if it hasn't already been added
    if (
      this.options.moduleSystem === 'ESM' &&
      exportType === 'named' &&
      !hasPreset(originalPresets, TS_EXPORT_KEYWORD_PRESET)
    ) {
      this.options.presets = [TS_EXPORT_KEYWORD_PRESET, ...originalPresets];
    }

    const outputModel = await this.render(model, inputModel);
    const modelDependencies = model.getNearestDependencies();
    //Create the correct dependency imports
    const modelDependencyImports = modelDependencies.map(({name}) => {
      const dependencyObject =
        exportType === 'named' ? `{${name}}` : name;
      return renderJavaScriptDependency(dependencyObject, `./${name}`, this.options.moduleSystem);
    });

    //Ensure we expose the model correctly, based on the module system and export type
    const cjsExport =
      exportType === 'default'
        ? `module.exports = ${outputModel.renderedName};`
        : `exports.${outputModel.renderedName} = ${outputModel.renderedName};`;
    const esmExport =
      exportType === 'default'
        ? `export default ${outputModel.renderedName};\n`
        : '';
    const modelCode = `${outputModel.result}\n${this.options.moduleSystem === 'CJS' ? cjsExport : esmExport}`;

    const outputContent = `${[...modelDependencyImports, ...outputModel.dependencies].join('\n')}
${modelCode}`;

    // Restore presets array from original copy
    this.options.presets = originalPresets;

    return RenderOutput.toRenderOutput({ result: outputContent, renderedName: outputModel.renderedName, dependencies: outputModel.dependencies });
  }

  render(model: ConstrainedMetaModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    if (model instanceof ConstrainedObjectModel) {
      if (this.options.modelType === 'interface') {
        return this.renderInterface(model, inputModel);
      }
      return this.renderClass(model, inputModel);
    } else if (model instanceof ConstrainedEnumModel) {
      return this.renderEnum(model, inputModel);
    } 
    return this.renderType(model, inputModel);
  }

  async renderClass(model: ConstrainedObjectModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    const presets = this.getPresets('class'); 
    const renderer = new ClassRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, renderedName: model.name, dependencies: renderer.dependencies});
  }

  async renderInterface(model: ConstrainedObjectModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    const presets = this.getPresets('interface'); 
    const renderer = new InterfaceRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, renderedName: model.name, dependencies: renderer.dependencies});
  }

  async renderEnum(model: ConstrainedEnumModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    const presets = this.getPresets('enum'); 
    const renderer = new EnumRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, renderedName: model.name, dependencies: renderer.dependencies});
  }

  async renderType(model: ConstrainedMetaModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    const presets = this.getPresets('type'); 
    const renderer = new TypeRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    return RenderOutput.toRenderOutput({result, renderedName: model.name, dependencies: renderer.dependencies});
  }
}
