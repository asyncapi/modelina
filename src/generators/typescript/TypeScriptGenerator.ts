import { hasPreset } from '../../helpers/PresetHelpers';
import {
  AbstractGenerator,
  CommonGeneratorOptions,
  defaultGeneratorOptions
} from '../AbstractGenerator';
import { CommonModel, CommonInputModel, RenderOutput } from '../../models';
import { TypeHelpers, ModelKind, CommonNamingConvention, CommonNamingConventionImplementation, TypeMapping, Constraints } from '../../helpers';
import { TS_EXPORT_KEYWORD_PRESET } from './presets';
import { TypeScriptPreset, TS_DEFAULT_PRESET } from './TypeScriptPreset';
import { ClassRenderer } from './renderers/ClassRenderer';
import { InterfaceRenderer } from './renderers/InterfaceRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { TypeRenderer } from './renderers/TypeRenderer';
import { TypeScriptRenderer } from './TypeScriptRenderer';
import { TypeScriptDefaultConstraints, TypeScriptDefaultTypeMapping } from './TypeScriptConstrainer';

export interface TypeScriptOptions extends CommonGeneratorOptions<TypeScriptPreset> {
  renderTypes?: boolean;
  modelType?: 'class' | 'interface';
  enumType?: 'enum' | 'union';
  namingConvention?: CommonNamingConvention;
  typeMapping: TypeMapping<TypeScriptRenderer>;
  constraints: Constraints
}
export interface TypeScriptRenderCompleteModelOptions {
  moduleSystem?: 'ESM' | 'CJS';
  exportType?: 'default' | 'named';
}

/**
 * Generator for TypeScript
 */
export class TypeScriptGenerator extends AbstractGenerator<TypeScriptOptions,TypeScriptRenderCompleteModelOptions> {
  static defaultOptions: TypeScriptOptions = {
    ...defaultGeneratorOptions,
    renderTypes: true,
    modelType: 'class',
    enumType: 'enum',
    defaultPreset: TS_DEFAULT_PRESET,
    namingConvention: CommonNamingConventionImplementation,
    typeMapping: TypeScriptDefaultTypeMapping,
    constraints: TypeScriptDefaultConstraints
  };

  constructor(
    options: Partial<TypeScriptOptions> = TypeScriptGenerator.defaultOptions,
  ) {
    const mergedOptions = {...TypeScriptGenerator.defaultOptions, ...options};

    super('TypeScript', TypeScriptGenerator.defaultOptions, mergedOptions);
  }

  /**
   * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
   *
   * @param model
   * @param inputModel
   * @param options
   */
  async renderCompleteModel(model: CommonModel, inputModel: CommonInputModel, {moduleSystem = 'ESM', exportType = 'default'}: TypeScriptRenderCompleteModelOptions): Promise<RenderOutput> {
    // Shallow copy presets so that we can restore it once we are done
    const originalPresets = [...(this.options.presets ? this.options.presets : [])];

    // Add preset that adds the `export` keyword if it hasn't already been added
    if (
      moduleSystem === 'ESM' &&
      exportType === 'named' &&
      !hasPreset(originalPresets, TS_EXPORT_KEYWORD_PRESET)
    ) {
      this.options.presets = [TS_EXPORT_KEYWORD_PRESET, ...originalPresets];
    }

    const outputModel = await this.render(model, inputModel);
    let modelDependencies = model.getNearestDependencies();
    //Ensure model dependencies have their rendered name
    modelDependencies = modelDependencies.map((dependencyModelName) => {
      return this.options.namingConvention?.type ? this.options.namingConvention.type(dependencyModelName, { inputModel, model: inputModel.models[String(dependencyModelName)] }) : dependencyModelName;
    });
    //Filter out any dependencies that is recursive to itself
    modelDependencies = modelDependencies.filter((dependencyModelName) => {
      return dependencyModelName !== outputModel.renderedName;
    });

    //Create the correct dependency imports
    modelDependencies = modelDependencies.map(
      (dependencyName) => {
        const dependencyObject =
          exportType === 'named' ? `{${dependencyName}}` : dependencyName;

        return moduleSystem === 'CJS'
          ? `const ${dependencyObject} = require('./${dependencyName}');`
          : `import ${dependencyObject} from './${dependencyName}';`;
      }
    );

    //Ensure we expose the model correctly, based on the module system and export type
    const cjsExport =
      exportType === 'default'
        ? `module.exports = ${outputModel.renderedName};`
        : `exports.${outputModel.renderedName} = ${outputModel.renderedName};`;
    const esmExport =
      exportType === 'default'
        ? `export default ${outputModel.renderedName};\n`
        : '';
    const modelCode = `${outputModel.result}\n${moduleSystem === 'CJS' ? cjsExport : esmExport}`;

    const outputContent = `${[...modelDependencies, ...outputModel.dependencies].join('\n')}

${modelCode}`;

    // Restore presets array from original copy
    this.options.presets = originalPresets;

    return RenderOutput.toRenderOutput({ result: outputContent, renderedName: outputModel.renderedName, dependencies: outputModel.dependencies });
  }

  render(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const kind = TypeHelpers.extractKind(model);
    switch (kind) {
    case ModelKind.OBJECT: {
      return this.renderModelType(model, inputModel);
    }
    case ModelKind.ENUM: {
      if (this.options.enumType === 'union') {
        return this.renderType(model, inputModel);
      }
      return this.renderEnum(model, inputModel);
    }
    default: return this.renderType(model, inputModel);
    }
  }

  async renderClass(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('class');
    const renderer = new ClassRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    const renderedName = renderer.nameType(model.$id, model);
    return RenderOutput.toRenderOutput({result, renderedName, dependencies: renderer.dependencies});
  }

  async renderInterface(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('interface');
    const renderer = new InterfaceRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    const renderedName = renderer.nameType(model.$id, model);
    return RenderOutput.toRenderOutput({result, renderedName, dependencies: renderer.dependencies});
  }

  async renderEnum(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('enum');
    const renderer = new EnumRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    const renderedName = renderer.nameType(model.$id, model);
    return RenderOutput.toRenderOutput({result, renderedName, dependencies: renderer.dependencies});
  }

  async renderType(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const presets = this.getPresets('type');
    const renderer = new TypeRenderer(this.options, this, presets, model, inputModel);
    const result = await renderer.runSelfPreset();
    const renderedName = renderer.nameType(model.$id, model);
    return RenderOutput.toRenderOutput({result, renderedName, dependencies: renderer.dependencies});
  }

  private renderModelType(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    const modelType = this.options.modelType;
    if (modelType === 'interface') {
      return this.renderInterface(model, inputModel);
    }
    return this.renderClass(model, inputModel);
  }
}
