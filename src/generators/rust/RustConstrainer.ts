import {
  defaultEnumKeyConstraints,
  defaultEnumValueConstraints
} from './constrainer/EnumConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { RustTypeMapping } from './RustGenerator';
import { FormatHelpers } from '../../helpers';
import {
  ConstrainedAnyModel,
  ConstrainedArrayModel,
  ConstrainedDictionaryModel,
  ConstrainedEnumModel,
  ConstrainedFloatModel,
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedReferenceModel,
  ConstrainedStringModel,
  ConstrainedTupleModel,
  ConstrainedUnionModel
} from '../../models';
import { defaultConstantConstraints } from './constrainer/ConstantConstrainer';

export function deriveHash(model: ConstrainedMetaModel): boolean {
  // float primitives and std::collection::HashMap do not implement Hash trait
  if (
    model instanceof ConstrainedDictionaryModel ||
    model instanceof ConstrainedFloatModel ||
    model instanceof ConstrainedAnyModel
  ) {
    return false;
  } else if (
    // all contents implement Hash trait
    model instanceof ConstrainedUnionModel ||
    model instanceof ConstrainedTupleModel ||
    model instanceof ConstrainedEnumModel ||
    model instanceof ConstrainedArrayModel ||
    model instanceof ConstrainedObjectModel
  ) {
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
  ) {
    return false;
  } else if (
    // all contents implement Copy trait
    model instanceof ConstrainedArrayModel ||
    model instanceof ConstrainedEnumModel ||
    model instanceof ConstrainedObjectModel ||
    model instanceof ConstrainedTupleModel ||
    model instanceof ConstrainedUnionModel
  ) {
    return allCopyable(model);
  }
  return true;
}

export function derivePartialEq(model: ConstrainedMetaModel): boolean {
  if (model instanceof ConstrainedAnyModel) {
    return false;
  }

  if (
    // all contents implement PartialEq trait
    model instanceof ConstrainedArrayModel ||
    model instanceof ConstrainedEnumModel ||
    model instanceof ConstrainedObjectModel ||
    model instanceof ConstrainedTupleModel ||
    model instanceof ConstrainedUnionModel ||
    model instanceof ConstrainedDictionaryModel
  ) {
    return allPartialEq(model);
  }
  return true;
}

export function deriveEq(model: ConstrainedMetaModel): boolean {
  if (!derivePartialEq(model)) {
    return false;
  }

  if (
    model instanceof ConstrainedFloatModel ||
    model instanceof ConstrainedAnyModel
  ) {
    return false;
  } else if (
    // all contents implement Eq trait
    model instanceof ConstrainedArrayModel ||
    model instanceof ConstrainedEnumModel ||
    model instanceof ConstrainedObjectModel ||
    model instanceof ConstrainedTupleModel ||
    model instanceof ConstrainedUnionModel ||
    model instanceof ConstrainedDictionaryModel
  ) {
    return allEq(model);
  }
  return true;
}

export function derivePartialOrd(model: ConstrainedMetaModel): boolean {
  if (
    model instanceof ConstrainedAnyModel ||
    model instanceof ConstrainedDictionaryModel
  ) {
    return false;
  } else if (
    // all contents implement PartialOrd trait
    model instanceof ConstrainedArrayModel ||
    model instanceof ConstrainedEnumModel ||
    model instanceof ConstrainedObjectModel ||
    model instanceof ConstrainedTupleModel ||
    model instanceof ConstrainedUnionModel
  ) {
    return allPartialOrd(model);
  }
  return true;
}

export function deriveOrd(model: ConstrainedMetaModel): boolean {
  if (!derivePartialOrd(model)) {
    return false;
  }

  if (
    model instanceof ConstrainedFloatModel ||
    model instanceof ConstrainedAnyModel ||
    model instanceof ConstrainedDictionaryModel
  ) {
    return false;
  } else if (
    // all contents implement Ord trait
    model instanceof ConstrainedArrayModel ||
    model instanceof ConstrainedEnumModel ||
    model instanceof ConstrainedObjectModel ||
    model instanceof ConstrainedTupleModel ||
    model instanceof ConstrainedUnionModel
  ) {
    return allOrd(model);
  }
  return true;
}

export function allPartialEq(model: ConstrainedMetaModel): boolean {
  if (model instanceof ConstrainedUnionModel) {
    return model.union.map(derivePartialEq).every((v) => v === true);
  } else if (model instanceof ConstrainedTupleModel) {
    return model.tuple
      .map((v) => derivePartialEq(v.value))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedObjectModel) {
    return Object.values(model.properties)
      .map((p) => derivePartialEq(p.property))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedArrayModel) {
    return derivePartialEq(model.valueModel);
  } else if (model instanceof ConstrainedEnumModel) {
    return model.values
      .map((v) => derivePartialEq(v.value))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedDictionaryModel) {
    return derivePartialEq(model.value);
  }
  return false;
}

export function allEq(model: ConstrainedMetaModel): boolean {
  if (model instanceof ConstrainedUnionModel) {
    return model.union.map(deriveEq).every((v) => v === true);
  } else if (model instanceof ConstrainedTupleModel) {
    return model.tuple.map((v) => deriveEq(v.value)).every((v) => v === true);
  } else if (model instanceof ConstrainedObjectModel) {
    return Object.values(model.properties)
      .map((p) => deriveEq(p.property))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedArrayModel) {
    return deriveEq(model.valueModel);
  } else if (model instanceof ConstrainedEnumModel) {
    return model.values.map((v) => deriveEq(v.value)).every((v) => v === true);
  } else if (model instanceof ConstrainedDictionaryModel) {
    return deriveEq(model.value);
  }
  return false;
}

export function allPartialOrd(model: ConstrainedMetaModel): boolean {
  if (model instanceof ConstrainedUnionModel) {
    return model.union.map(derivePartialOrd).every((v) => v === true);
  } else if (model instanceof ConstrainedTupleModel) {
    return model.tuple
      .map((v) => derivePartialOrd(v.value))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedObjectModel) {
    return Object.values(model.properties)
      .map((p) => derivePartialOrd(p.property))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedArrayModel) {
    return derivePartialOrd(model.valueModel);
  } else if (model instanceof ConstrainedEnumModel) {
    return model.values
      .map((v) => derivePartialOrd(v.value))
      .every((v) => v === true);
  }
  return false;
}

export function allOrd(model: ConstrainedMetaModel): boolean {
  if (model instanceof ConstrainedUnionModel) {
    return model.union.map(deriveOrd).every((v) => v === true);
  } else if (model instanceof ConstrainedTupleModel) {
    return model.tuple.map((v) => deriveOrd(v.value)).every((v) => v === true);
  } else if (model instanceof ConstrainedObjectModel) {
    return Object.values(model.properties)
      .map((p) => deriveOrd(p.property))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedArrayModel) {
    return deriveOrd(model.valueModel);
  } else if (model instanceof ConstrainedEnumModel) {
    return model.values.map((v) => deriveOrd(v.value)).every((v) => v === true);
  }
  return false;
}

export function allHashable(model: ConstrainedMetaModel): boolean {
  if (model instanceof ConstrainedUnionModel) {
    return model.union.map(deriveHash).every((v) => v === true);
  } else if (model instanceof ConstrainedTupleModel) {
    return model.tuple.map((v) => deriveHash(v.value)).every((v) => v === true);
  } else if (model instanceof ConstrainedObjectModel) {
    return Object.values(model.properties)
      .map((p) => deriveHash(p.property))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedArrayModel) {
    return deriveHash(model.valueModel);
  } else if (model instanceof ConstrainedEnumModel) {
    return model.values
      .map((v) => deriveHash(v.value))
      .every((v) => v === true);
  }
  return false;
}

export function allCopyable(model: ConstrainedMetaModel): boolean {
  if (model instanceof ConstrainedUnionModel) {
    return model.union.map(deriveCopy).every((v) => v === true);
  } else if (model instanceof ConstrainedTupleModel) {
    return model.tuple.map((v) => deriveCopy(v.value)).every((v) => v === true);
  } else if (model instanceof ConstrainedObjectModel) {
    return Object.values(model.properties)
      .map((p) => deriveCopy(p.property))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedArrayModel) {
    return deriveCopy(model.valueModel);
  } else if (model instanceof ConstrainedEnumModel) {
    return model.values
      .map((v) => deriveCopy(v.value))
      .every((v) => v === true);
  }
  return false;
}

export const RustDefaultTypeMapping: RustTypeMapping = {
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
    switch (constrainedModel.options.format) {
      case 'fp32':
      case 'f32':
      case 'float32':
        return 'f32';
      default:
        return 'f64';
    }
  },
  Integer({ constrainedModel }): string {
    const type = 'i32';
    switch (constrainedModel.options.format) {
      case 'integer':
      case 'int32':
        return type;
      case 'long':
      case 'int64':
        return 'i64';
      default:
        return type;
    }
  },
  String({ constrainedModel }): string {
    switch (constrainedModel.options.format) {
      case 'bytes':
      case 'bytes[]':
      case 'binary':
        return 'Vec<u8>';
      default:
        return 'String';
    }
  },
  Boolean(): string {
    return 'bool';
  },
  Tuple({ constrainedModel }): string {
    return `${constrainedModel.name}`;
  },
  Array({ constrainedModel }): string {
    const prefix =
      constrainedModel.valueModel instanceof ConstrainedReferenceModel
        ? 'crate::'
        : '';
    return `Vec<${prefix}${FormatHelpers.upperFirst(
      constrainedModel.valueModel.type
    )}>`;
  },
  Enum({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Union({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Dictionary({ constrainedModel }): string {
    const key_prefix =
      constrainedModel.key instanceof ConstrainedReferenceModel
        ? 'crate::'
        : '';
    const value_prefix =
      constrainedModel.value instanceof ConstrainedReferenceModel
        ? 'crate::'
        : '';
    return `std::collections::HashMap<${key_prefix}${constrainedModel.key.type}, ${value_prefix}${constrainedModel.value.type}>`;
  }
};

export const RustDefaultConstraints = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints(),
  constant: defaultConstantConstraints()
};
