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
    if (
      property.property instanceof ConstrainedReferenceModel &&
      property.property.ref instanceof ConstrainedEnumModel
    ) {
      const defaultEnumValue = property.property.ref.values.find(
        (valueModel) =>
          valueModel.originalInput === property.property.originalInput.default
      );
      if (defaultEnumValue === undefined) {
        return `private ${property.property.type} ${property.propertyName};`;
      }
      return `private ${property.property.type} ${property.propertyName} = ${property.property.type}.${defaultEnumValue.key};`;
    }
    // Append type suffixes for boxed numeric defaults: Long(2) → 2L, Float(1.5) → 1.5f
    const defaultValue = property.property.originalInput.default;
    const numValue = String(defaultValue);
    if ((typeof defaultValue === 'number' || (!isNaN(Number(defaultValue)) && defaultValue !== '')) && !numValue.includes('"')) {
      if (property.property.type === 'Long' || property.property.type === 'long') {
        return `private ${property.property.type} ${property.propertyName} = ${numValue}L;`;
      }
      if (property.property.type === 'Float' || property.property.type === 'float') {
        return `private ${property.property.type} ${property.propertyName} = ${numValue}f;`;
      }
      if (property.property.type === 'Double' || property.property.type === 'double') {
        return `private ${property.property.type} ${property.propertyName} = ${numValue}d;`;
      }
    }
    return `private ${property.property.type} ${property.propertyName} = ${defaultValue};`;
  }
}
