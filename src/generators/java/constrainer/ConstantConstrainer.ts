import {
  ConstrainedEnumModel,
  ConstrainedReferenceModel,
  ConstrainedStringModel
} from '../../../models';

import { ConstantConstraint } from '../../../helpers';

export function defaultConstantConstraints(): ConstantConstraint {
  return ({ constrainedObjectPropertyModel, constValue }) => {
    let constrainedConstant = constValue;

    if (
      constrainedObjectPropertyModel.property instanceof
        ConstrainedReferenceModel &&
      constrainedObjectPropertyModel.property.ref instanceof
        ConstrainedEnumModel
    ) {
      const constrainedEnumValueModel =
        constrainedObjectPropertyModel.property.ref?.values.find(
          (value) => value.originalInput === constValue
        );

      if (constrainedEnumValueModel) {
        constrainedConstant = `${constrainedObjectPropertyModel.property.type}.${constrainedEnumValueModel.key}`;
      }
    } else if (
      constrainedObjectPropertyModel.property instanceof ConstrainedStringModel
    ) {
      constrainedConstant = `"${constValue}"`;
    }

    return constrainedConstant;
  };
}
