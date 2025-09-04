import {
  ConstrainedEnumModel,
  ConstrainedObjectPropertyModel,
  ConstrainedReferenceModel
} from '../../models';

export class JavaDefaultRendererUtil {
  static renderFieldWithDefault(
    property: ConstrainedObjectPropertyModel
  ): string {
    if (property.property.type === 'LocalDate') {
      return `private ${property.property.type} ${property.propertyName} = LocalDate.parse("${property.property.originalInput.default}");`;
    }
    if (property.property.type === 'OffsetTime') {
      return `private ${property.property.type} ${property.propertyName} = OffsetTime.parse("${property.property.originalInput.default}");`;
    }
    if (property.property.options?.format === 'date-time') {
      if (property.property.type === 'java.time.OffsetDateTime') {
        return `private ${property.property.type} ${property.propertyName} = java.time.OffsetDateTime.parse("${property.property.originalInput.default}");`;
      } else if (property.property.type === 'Instant') {
        return `private ${property.property.type} ${property.propertyName} = Instant.parse("${property.property.originalInput.default}");`;
      }
    }
    if (property.property.type === 'UUID') {
      return `private ${property.property.type} ${property.propertyName} = UUID.fromString("${property.property.originalInput.default}");`;
    }
    if (property.property.type === 'String') {
      return `private ${property.property.type} ${property.propertyName} = "${property.property.originalInput.default}";`;
    }
    if (property.property.type === 'BigDecimal') {
      return `private ${property.property.type} ${property.propertyName} = new BigDecimal(${property.property.originalInput.default});`;
    }
    if (property.property instanceof ConstrainedReferenceModel && property.property.ref instanceof ConstrainedEnumModel) {
      const defaultEnumValue = property.property.ref.values.find(valueModel => valueModel.originalInput === property.property.originalInput.default);
      if (defaultEnumValue === undefined) {
        return `private ${property.property.type} ${property.propertyName};`;
      } else {
        return `private ${property.property.type} ${property.propertyName} = ${property.property.type}.${defaultEnumValue.key};`;
      }
    }
    return `private ${property.property.type} ${property.propertyName} = ${property.property.originalInput.default};`;
  }
}
