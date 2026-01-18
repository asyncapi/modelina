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

export function deriveHash(
  model: ConstrainedMetaModel,
  visited: Set<ConstrainedMetaModel> = new Set()
): boolean {
  // Prevent infinite recursion for circular references
  if (visited.has(model)) {
    return true;
  }
  visited.add(model);

  // float primitives and std::collection::HashMap do not implement Hash trait
  if (
    model instanceof ConstrainedDictionaryModel ||
    model instanceof ConstrainedFloatModel ||
    model instanceof ConstrainedAnyModel
  ) {
    return false;
  } else if (model instanceof ConstrainedReferenceModel) {
    // Follow the reference to check the actual referenced model
    return deriveHash(model.ref, visited);
  } else if (
    // all contents implement Hash trait
    model instanceof ConstrainedUnionModel ||
    model instanceof ConstrainedTupleModel ||
    model instanceof ConstrainedEnumModel ||
    model instanceof ConstrainedArrayModel ||
    model instanceof ConstrainedObjectModel
  ) {
    return allHashable(model, visited);
  }
  return true;
}

export function deriveCopy(
  model: ConstrainedMetaModel,
  visited: Set<ConstrainedMetaModel> = new Set()
): boolean {
  // Prevent infinite recursion for circular references
  if (visited.has(model)) {
    return true;
  }
  visited.add(model);

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
    return allCopyable(model, visited);
  }
  return true;
}

export function derivePartialEq(
  model: ConstrainedMetaModel,
  visited: Set<ConstrainedMetaModel> = new Set()
): boolean {
  // Prevent infinite recursion for circular references
  if (visited.has(model)) {
    return true;
  }
  visited.add(model);

  if (model instanceof ConstrainedAnyModel) {
    return false;
  }

  if (model instanceof ConstrainedReferenceModel) {
    // Follow the reference to check the actual referenced model
    return derivePartialEq(model.ref, visited);
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
    return allPartialEq(model, visited);
  }
  return true;
}

export function deriveEq(
  model: ConstrainedMetaModel,
  visited: Set<ConstrainedMetaModel> = new Set()
): boolean {
  // Prevent infinite recursion for circular references
  if (visited.has(model)) {
    return true;
  }
  visited.add(model);

  if (!derivePartialEq(model, new Set(visited))) {
    return false;
  }

  if (
    model instanceof ConstrainedFloatModel ||
    model instanceof ConstrainedAnyModel
  ) {
    return false;
  } else if (model instanceof ConstrainedReferenceModel) {
    // Follow the reference to check the actual referenced model
    return deriveEq(model.ref, visited);
  } else if (
    // all contents implement Eq trait
    model instanceof ConstrainedArrayModel ||
    model instanceof ConstrainedEnumModel ||
    model instanceof ConstrainedObjectModel ||
    model instanceof ConstrainedTupleModel ||
    model instanceof ConstrainedUnionModel ||
    model instanceof ConstrainedDictionaryModel
  ) {
    return allEq(model, visited);
  }
  return true;
}

export function derivePartialOrd(
  model: ConstrainedMetaModel,
  visited: Set<ConstrainedMetaModel> = new Set()
): boolean {
  // Prevent infinite recursion for circular references
  if (visited.has(model)) {
    return true;
  }
  visited.add(model);

  if (
    model instanceof ConstrainedAnyModel ||
    model instanceof ConstrainedDictionaryModel
  ) {
    return false;
  } else if (model instanceof ConstrainedReferenceModel) {
    // Follow the reference to check the actual referenced model
    return derivePartialOrd(model.ref, visited);
  } else if (
    // all contents implement PartialOrd trait
    model instanceof ConstrainedArrayModel ||
    model instanceof ConstrainedEnumModel ||
    model instanceof ConstrainedObjectModel ||
    model instanceof ConstrainedTupleModel ||
    model instanceof ConstrainedUnionModel
  ) {
    return allPartialOrd(model, visited);
  }
  return true;
}

export function deriveOrd(
  model: ConstrainedMetaModel,
  visited: Set<ConstrainedMetaModel> = new Set()
): boolean {
  // Prevent infinite recursion for circular references
  if (visited.has(model)) {
    return true;
  }
  visited.add(model);

  if (!derivePartialOrd(model, new Set(visited))) {
    return false;
  }

  if (
    model instanceof ConstrainedFloatModel ||
    model instanceof ConstrainedAnyModel ||
    model instanceof ConstrainedDictionaryModel
  ) {
    return false;
  } else if (model instanceof ConstrainedReferenceModel) {
    // Follow the reference to check the actual referenced model
    return deriveOrd(model.ref, visited);
  } else if (
    // all contents implement Ord trait
    model instanceof ConstrainedArrayModel ||
    model instanceof ConstrainedEnumModel ||
    model instanceof ConstrainedObjectModel ||
    model instanceof ConstrainedTupleModel ||
    model instanceof ConstrainedUnionModel
  ) {
    return allOrd(model, visited);
  }
  return true;
}

export function allPartialEq(
  model: ConstrainedMetaModel,
  visited: Set<ConstrainedMetaModel> = new Set()
): boolean {
  if (model instanceof ConstrainedUnionModel) {
    return model.union
      .map((m) => derivePartialEq(m, new Set(visited)))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedTupleModel) {
    return model.tuple
      .map((v) => derivePartialEq(v.value, new Set(visited)))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedObjectModel) {
    return Object.values(model.properties)
      .map((p) => derivePartialEq(p.property, new Set(visited)))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedArrayModel) {
    return derivePartialEq(model.valueModel, new Set(visited));
  } else if (model instanceof ConstrainedEnumModel) {
    return model.values
      .map((v) => derivePartialEq(v.value, new Set(visited)))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedDictionaryModel) {
    return derivePartialEq(model.value, new Set(visited));
  }
  return false;
}

export function allEq(
  model: ConstrainedMetaModel,
  visited: Set<ConstrainedMetaModel> = new Set()
): boolean {
  if (model instanceof ConstrainedUnionModel) {
    return model.union
      .map((m) => deriveEq(m, new Set(visited)))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedTupleModel) {
    return model.tuple
      .map((v) => deriveEq(v.value, new Set(visited)))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedObjectModel) {
    return Object.values(model.properties)
      .map((p) => deriveEq(p.property, new Set(visited)))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedArrayModel) {
    return deriveEq(model.valueModel, new Set(visited));
  } else if (model instanceof ConstrainedEnumModel) {
    return model.values
      .map((v) => deriveEq(v.value, new Set(visited)))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedDictionaryModel) {
    return deriveEq(model.value, new Set(visited));
  }
  return false;
}

export function allPartialOrd(
  model: ConstrainedMetaModel,
  visited: Set<ConstrainedMetaModel> = new Set()
): boolean {
  if (model instanceof ConstrainedUnionModel) {
    return model.union
      .map((m) => derivePartialOrd(m, new Set(visited)))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedTupleModel) {
    return model.tuple
      .map((v) => derivePartialOrd(v.value, new Set(visited)))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedObjectModel) {
    return Object.values(model.properties)
      .map((p) => derivePartialOrd(p.property, new Set(visited)))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedArrayModel) {
    return derivePartialOrd(model.valueModel, new Set(visited));
  } else if (model instanceof ConstrainedEnumModel) {
    return model.values
      .map((v) => derivePartialOrd(v.value, new Set(visited)))
      .every((v) => v === true);
  }
  return false;
}

export function allOrd(
  model: ConstrainedMetaModel,
  visited: Set<ConstrainedMetaModel> = new Set()
): boolean {
  if (model instanceof ConstrainedUnionModel) {
    return model.union
      .map((m) => deriveOrd(m, new Set(visited)))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedTupleModel) {
    return model.tuple
      .map((v) => deriveOrd(v.value, new Set(visited)))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedObjectModel) {
    return Object.values(model.properties)
      .map((p) => deriveOrd(p.property, new Set(visited)))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedArrayModel) {
    return deriveOrd(model.valueModel, new Set(visited));
  } else if (model instanceof ConstrainedEnumModel) {
    return model.values
      .map((v) => deriveOrd(v.value, new Set(visited)))
      .every((v) => v === true);
  }
  return false;
}

export function allHashable(
  model: ConstrainedMetaModel,
  visited: Set<ConstrainedMetaModel> = new Set()
): boolean {
  if (model instanceof ConstrainedUnionModel) {
    return model.union
      .map((m) => deriveHash(m, new Set(visited)))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedTupleModel) {
    return model.tuple
      .map((v) => deriveHash(v.value, new Set(visited)))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedObjectModel) {
    return Object.values(model.properties)
      .map((p) => deriveHash(p.property, new Set(visited)))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedArrayModel) {
    return deriveHash(model.valueModel, new Set(visited));
  } else if (model instanceof ConstrainedEnumModel) {
    return model.values
      .map((v) => deriveHash(v.value, new Set(visited)))
      .every((v) => v === true);
  }
  return false;
}

export function allCopyable(
  model: ConstrainedMetaModel,
  visited: Set<ConstrainedMetaModel> = new Set()
): boolean {
  if (model instanceof ConstrainedUnionModel) {
    return model.union
      .map((m) => deriveCopy(m, new Set(visited)))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedTupleModel) {
    return model.tuple
      .map((v) => deriveCopy(v.value, new Set(visited)))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedObjectModel) {
    return Object.values(model.properties)
      .map((p) => deriveCopy(p.property, new Set(visited)))
      .every((v) => v === true);
  } else if (model instanceof ConstrainedArrayModel) {
    return deriveCopy(model.valueModel, new Set(visited));
  } else if (model instanceof ConstrainedEnumModel) {
    return model.values
      .map((v) => deriveCopy(v.value, new Set(visited)))
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
    switch (constrainedModel.options.format) {
      case 'int8':
      case 'i8':
        return 'i8';
      case 'int16':
      case 'i16':
        return 'i16';
      case 'int32':
      case 'integer':
      case 'i32':
        return 'i32';
      case 'int64':
      case 'long':
      case 'i64':
        return 'i64';
      case 'int128':
      case 'i128':
        return 'i128';
      case 'uint8':
      case 'u8':
        return 'u8';
      case 'uint16':
      case 'u16':
        return 'u16';
      case 'uint32':
      case 'u32':
        return 'u32';
      case 'uint64':
      case 'u64':
        return 'u64';
      case 'uint128':
      case 'u128':
        return 'u128';
      default:
        return 'i32';
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
