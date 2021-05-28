import { 
  AbstractGenerator, 
  CommonGeneratorOptions,
  defaultGeneratorOptions,
} from '../AbstractGenerator';
import { CommonModel, CommonInputModel } from '../../models';
import { TypeHelpers, ModelKind } from '../../helpers';

import { TypeScriptPreset, TS_DEFAULT_PRESET } from './TypeScriptPreset';

import { ClassRenderer } from './renderers/ClassRenderer';
import { InterfaceRenderer } from './renderers/InterfaceRenderer';
import { EnumRenderer } from './renderers/EnumRenderer';
import { TypeRenderer } from './renderers/TypeRenderer';

export interface TypeScriptOptions extends CommonGeneratorOptions<TypeScriptPreset> {
  renderTypes?: boolean
  modelType?: 'class' | 'interface';
}

/**
 * Generator for TypeScript
 */
export class TypeScriptGenerator extends AbstractGenerator<TypeScriptOptions> {
  static defaultOptions: TypeScriptOptions = {
    ...defaultGeneratorOptions,
    renderTypes: true,
    modelType: 'class',
    defaultPreset: TS_DEFAULT_PRESET,
  };

  constructor(
    options: TypeScriptOptions = TypeScriptGenerator.defaultOptions,
  ) {
    super('TypeScript', TypeScriptGenerator.defaultOptions, options);
  }

  render(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const kind = TypeHelpers.extractKind(model);
    switch (kind) {
    case ModelKind.OBJECT: {
      return this.renderModelType(model, inputModel);
    }
    case ModelKind.ENUM: {
      return this.renderEnum(model, inputModel);
    }
    default: return this.renderType(model, inputModel);
    }
  }

  renderClass(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const presets = this.getPresets('class'); 
    const renderer = new ClassRenderer(this.options, presets, model, inputModel);
    return renderer.runSelfPreset();
  }

  renderInterface(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const presets = this.getPresets('interface'); 
    const renderer = new InterfaceRenderer(this.options, presets, model, inputModel);
    return renderer.runSelfPreset();
  }

  renderEnum(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const presets = this.getPresets('enum'); 
    const renderer = new EnumRenderer(this.options, presets, model, inputModel);
    return renderer.runSelfPreset();
  }

  renderType(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const presets = this.getPresets('type'); 
    const renderer = new TypeRenderer(this.options, presets, model, inputModel);
    return renderer.runSelfPreset();
  }

  private renderModelType(model: CommonModel, inputModel: CommonInputModel): Promise<string> {
    const modelType = this.options.modelType;
    switch (modelType) {
    case 'interface': {
      return this.renderInterface(model, inputModel);
    }
    default: return this.renderClass(model, inputModel);
    }
  }
}
