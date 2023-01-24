import {
  ConstrainedEnumModel,
  ConstrainedObjectModel,
  ConstrainedReferenceModel,
  ConstrainedUnionModel,
  ConstrainedEnumValueModel
} from '../../../models';
import { EnumRenderer } from '../renderers/EnumRenderer';
import { RustPreset } from '../RustPreset';
import { Logger } from '../../../utils';
import { StructRenderer } from '../renderers/StructRenderer';

export interface RustCommonPresetOptions {
  implementDefault: boolean;
  deriveDefault: boolean;
  implementNew: boolean;
}

export const defaultRustCommonPresetOptions: RustCommonPresetOptions = {
  implementDefault: true,
  deriveDefault: true,
  implementNew: true
};

/**
 * Get default first member of enum
 */
function getEnumDefaultOrFirst(
  model: ConstrainedEnumModel
): ConstrainedEnumValueModel {
  const maybeDefault = model.values.find((v, idx) => {
    const originalValue = model.originalInput.enum[Number(idx)];
    if (
      model.originalInput.default &&
      model.originalInput.default === originalValue
    ) {
      return v;
    }
  });
  if (maybeDefault === undefined) {
    Logger.warn(
      `Schema does not provide default value for field ${model.originalInput} - this is incompatible with RustGenerator's #[derive Default] implementation. Please re-run with { deriveDefault: false } option`
    );
    return model.values[0];
  }
  return maybeDefault;
}

/**
 * Render `impl Default` for enum model
 */
function renderImplementDefault({
  model
}: {
  renderer: EnumRenderer;
  model: ConstrainedEnumModel;
}): string {
  const defaultConstrainedValue = getEnumDefaultOrFirst(model);

  const defaultValue = defaultConstrainedValue.key;
  return `impl Default for ${model.name} {
    fn default() -> ${model.name} {
        ${model.name}::${defaultValue}
    }
}`;
}

/**
 * Render `new` constructor function in struct impl
 */
function renderImplementNew({
  model,
  renderer
}: {
  renderer: StructRenderer;
  model: ConstrainedObjectModel;
}) {
  const args: string[] = [];
  const fields: string[] = [];
  const properties = model.properties || {};
  for (const v of Object.values(properties)) {
    const prefix =
      v.property instanceof ConstrainedReferenceModel ? 'crate::' : '';
    const fieldType = prefix + v.property.type;

    if (v.required) {
      args.push(`${v.propertyName}: ${fieldType}`);
      if (v.property instanceof ConstrainedReferenceModel) {
        fields.push(`${v.propertyName}: Box::new(${v.propertyName}),`);
      } else {
        fields.push(`${v.propertyName},`);
      }
      // use map to box reference if field is optional
    } else if (
      !v.required &&
      (v.property instanceof ConstrainedReferenceModel ||
        v.property instanceof ConstrainedUnionModel)
    ) {
      args.push(`${v.propertyName}: Option<crate::${v.property.type}>`);
      fields.push(`${v.propertyName}: ${v.propertyName}.map(Box::new),`);
    } else {
      args.push(`${v.propertyName}: Option<${fieldType}>`);
      fields.push(`${v.propertyName},`);
    }
  }
  const fieldsBlock = renderer.renderBlock(fields);
  return `pub fn new(${args.join(', ')}) -> ${model.name} {
    ${model.name} {
${renderer.indent(fieldsBlock, 8)}
    }
}`;
}

export const RUST_COMMON_PRESET: RustPreset<RustCommonPresetOptions> = {
  enum: {
    additionalContent({ renderer, model, content, options }) {
      options = options || defaultRustCommonPresetOptions;
      const blocks: string[] = [];
      if (options.implementDefault) {
        blocks.push(renderImplementDefault({ renderer, model }));
      }
      return renderer.renderBlock([content, ...blocks], 2);
    }
  },
  struct: {
    additionalContent({ renderer, model, content, options }) {
      options = options || defaultRustCommonPresetOptions;
      const fnBlocks = [];
      if (options.implementNew) {
        fnBlocks.push(renderImplementNew({ model, renderer }));
      }

      const fnBlock = renderer.renderBlock(fnBlocks);
      const contentBlock = `
impl ${model.name} {
${renderer.indent(fnBlock, 4)}
}
`;
      content = renderer.renderBlock([content, contentBlock]);
      return content;
    }
  },
  tuple: {
    additionalContent({ renderer, model, content, options }) {
      options = options || defaultRustCommonPresetOptions;

      if (options.implementNew) {
        const properties = model.tuple;
        const args: string[] = Object.values(properties).map(
          (v, idx) => `value_${idx}: ${v.value.type}`
        );
        const fields: string[] = Object.values(properties).map(
          (_v, idx) => `value_${idx}`
        );
        const implementNew = `
impl ${model.name} {
    pub fn new(${args.join(', ')}) -> ${model.name} {
        ${model.name}(${fields.join(', ')})
    }
}
`;
        content = renderer.renderBlock([content, implementNew]);
      }
      return content;
    }
  }
};
