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
    const defaultValue = property.property.originalInput.default;
    const literal = JavaDefaultRendererUtil.numericLiteral(
      property.property.type,
      defaultValue
    );
    return `private ${property.property.type} ${property.propertyName} = ${literal};`;
  }

  /**
   * Boxed numeric types need a typed literal suffix, otherwise the generated
   * assignment does not compile (e.g. `Long x = 2;` — an int literal cannot be
   * assigned to a Long). Long → 2L, Float → 1.5f, Double → 3.14d. Non-numeric
   * defaults (and Integer, which accepts a plain int literal) are returned
   * unchanged.
   */
  private static numericLiteral(type: string, defaultValue: unknown): string {
    const isNumeric =
      typeof defaultValue === 'number' ||
      (typeof defaultValue === 'string' &&
        defaultValue.trim() !== '' &&
        !Number.isNaN(Number(defaultValue)));
    if (!isNumeric) {
      return `${defaultValue}`;
    }
    switch (type) {
      case 'Long':
      case 'long':
        return `${defaultValue}L`;
      case 'Float':
      case 'float':
        return `${defaultValue}f`;
      case 'Double':
      case 'double':
        return `${defaultValue}d`;
      default:
        return `${defaultValue}`;
    }
  }
}
