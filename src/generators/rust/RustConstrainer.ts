import { defaultEnumKeyConstraints, defaultEnumValueConstraints } from './constrainer/EnumConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { RustOptions } from './RustGenerator';
import { FormatHelpers, Constraints, TypeMapping } from '../../helpers';
import { ConstrainedAnyModel, ConstrainedArrayModel, ConstrainedDictionaryModel, ConstrainedEnumModel, ConstrainedFloatModel, ConstrainedMetaModel, ConstrainedObjectModel, ConstrainedReferenceModel, ConstrainedStringModel, ConstrainedTupleModel, ConstrainedUnionModel } from '../../models';

export function deriveHash(model: ConstrainedMetaModel): boolean {
  // float primitives and std::collection::HashMap do not implement Hash trait
  if (
    model instanceof ConstrainedDictionaryModel ||
    model instanceof ConstrainedFloatModel ||
    model instanceof ConstrainedAnyModel
  ) { return false; } else if (
    // all contents implement Hash trait
    model instanceof ConstrainedUnionModel ||
    model instanceof ConstrainedTupleModel ||
    model instanceof ConstrainedEnumModel ||
    model instanceof ConstrainedArrayModel ||
    model instanceof ConstrainedObjectModel) {
    return allHashable(model);
  }
  return true;
}

export function deriveCopy(model: ConstrainedMetaModel): boolean {
  if (
    // serde_json::Value, HashMap, Box, and String do not implement copy
    model instanceof ConstrainedAnyModel ||
    model instanceof ConstrainedDictionaryModel ||
    model instanceof ConstrainedReferenceModel ||
    model instanceof ConstrainedStringModel
  ) { return false; } else if (
    // all contents implement Copy trait
    model instanceof ConstrainedArrayModel ||
    model instanceof ConstrainedEnumModel ||
    model instanceof ConstrainedObjectModel ||
    model instanceof ConstrainedTupleModel ||
    model instanceof ConstrainedUnionModel
  ) { return allCopyable(model); }
  return true;
}

export function deriveEq(model: ConstrainedMetaModel): boolean {
  if (model instanceof ConstrainedFloatModel || model instanceof ConstrainedAnyModel) { return false; } else if (
    // all contents implement Eq trait
    model instanceof ConstrainedArrayModel ||
    model instanceof ConstrainedEnumModel ||
    model instanceof ConstrainedObjectModel ||
    model instanceof ConstrainedTupleModel ||
    model instanceof ConstrainedUnionModel
  ) { return allEq(model); }
  return true;
}

export function allEq(model: ConstrainedMetaModel): boolean {
  if (model instanceof ConstrainedUnionModel) {
    return model.union.map(deriveEq).every(v => v === true);
  } else if (model instanceof ConstrainedTupleModel) {
    return model.tuple.map(v => deriveEq(v.value)).every(v => v === true);
  } else if (model instanceof ConstrainedObjectModel) {
    return Object.values(model.properties).map(p => deriveEq(p.property)).every(v => v === true);
  } else if (model instanceof ConstrainedArrayModel) {
    return deriveEq(model.valueModel);
  } else if (model instanceof ConstrainedEnumModel) {
    return model.values.map(v => deriveEq(v.value)).every(v => v === true);
  }
  return false;
}

export function allHashable(model: ConstrainedMetaModel): boolean {
  if (model instanceof ConstrainedUnionModel) {
    return model.union.map(deriveHash).every(v => v === true);
  } else if (model instanceof ConstrainedTupleModel) {
    return model.tuple.map(v => deriveHash(v.value)).every(v => v === true);
  } else if (model instanceof ConstrainedObjectModel) {
    return Object.values(model.properties).map(p => deriveHash(p.property)).every(v => v === true);
  } else if (model instanceof ConstrainedArrayModel) {
    return deriveHash(model.valueModel);
  } else if (model instanceof ConstrainedEnumModel) {
    return model.values.map(v => deriveHash(v.value)).every(v => v === true);
  }
  return false;
}

export function allCopyable(model: ConstrainedMetaModel): boolean {
  if (model instanceof ConstrainedUnionModel) {
    return model.union.map(deriveCopy).every(v => v === true);
  } else if (model instanceof ConstrainedTupleModel) {
    return model.tuple.map(v => deriveCopy(v.value)).every(v => v === true);
  } else if (model instanceof ConstrainedObjectModel) {
    return Object.values(model.properties).map(p => deriveCopy(p.property)).every(v => v === true);
  } else if (model instanceof ConstrainedArrayModel) {
    return deriveCopy(model.valueModel);
  } else if (model instanceof ConstrainedEnumModel) {
    return model.values.map(v => deriveCopy(v.value)).every(v => v === true);
  }
  return false;
}

export const RustDefaultTypeMapping: TypeMapping<RustOptions> = {
  Object({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Reference({ constrainedModel }): string {
    return `${constrainedModel.name}`;
  },
  Any(): string {
    return 'serde_json::Value';
  },
  Float({ constrainedModel }): string {
    let type = 'f64';
    const format = constrainedModel.originalInput && constrainedModel.originalInput['format'];
    switch (format) {
    case 'fp32':
    case 'f32':
    case 'float32':
      type = 'f32';
      break;
    }
    return type;
  },
  Integer({ constrainedModel }): string {
    let type = 'i32';
    const format = constrainedModel.originalInput && constrainedModel.originalInput['format'];
    switch (format) {
    case 'integer':
    case 'int32':
      break;
    case 'long':
    case 'int64':
      type = 'i64';
      break;
    }
    return type;
  },
  String({ constrainedModel }): string {
    let type = 'String';
    const format = constrainedModel.originalInput && constrainedModel.originalInput['format'];
    switch (format) {
    case 'bytes':
    case 'bytes[]':
    case 'binary':
      type = 'Vec<u8>';
      break;
    }
    return type;
  },
  Boolean(): string {
    return 'bool';
  },
  Tuple({ constrainedModel }): string {
    return `${constrainedModel.name}`;
  },
  Array({ constrainedModel }): string {
    return `Vec<${FormatHelpers.upperFirst(constrainedModel.valueModel.type)}>`;
  },
  Enum({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Union({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Dictionary({ constrainedModel }): string {
    return `std::collections::HashMap<${constrainedModel.key.type}, ${constrainedModel.value.type}>`;
  }
};

export const RustDefaultConstraints: Constraints = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints()
};
