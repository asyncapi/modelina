import {
  ConstrainedArrayModel,
  ConstrainedObjectPropertyModel
} from '../../models';
import { JavaOptions } from './JavaGenerator';
import { JavaDependencyManager } from './JavaDependencyManager';

export class JavaImportUtils {
  public static addCollectionDependencies(
    options: JavaOptions,
    properties: Record<string, ConstrainedObjectPropertyModel>,
    dependencyManager: JavaDependencyManager
  ): void {
    let needsList = false;
    let needsSet = false;
    for (const prop of Object.values(properties)) {
      const propertyModel = prop.property;
      if (
        propertyModel instanceof ConstrainedArrayModel &&
        options.collectionType === 'List'
      ) {
        const isUnique = propertyModel.originalInput?.uniqueItems === true;
        if (isUnique) {
          needsSet = true;
        } else {
          needsList = true;
        }
      }
    }
    if (needsList) {
      dependencyManager.addDependency('import java.util.List;');
    }
    if (needsSet) {
      dependencyManager.addDependency('import java.util.Set;');
    }
  }

  public static addDependenciesForStringTypes(
    properties: Record<string, ConstrainedObjectPropertyModel>,
    dependencyManager: JavaDependencyManager
  ): void {
    const containsDate = Object.values(properties).some(
      (prop) => prop.property.options?.format === 'date'
    );
    if (containsDate) {
      dependencyManager.addDependency('import java.time.LocalDate;');
    }
    const containsDateTime = Object.values(properties).some(
      (prop) =>
        (prop.property.options?.format === 'date-time' ||
          prop.property.options?.format === 'dateTime') &&
        prop.property.type === 'OffsetDateTime'
    );
    if (containsDateTime) {
      dependencyManager.addDependency('import java.time.OffsetDateTime;');
    }
    const containsTime = Object.values(properties).some(
      (prop) => prop.property.options?.format === 'time'
    );
    if (containsTime) {
      dependencyManager.addDependency('import java.time.OffsetTime;');
    }
    const containsDuration = Object.values(properties).some(
      (prop) => prop.property.options?.format === 'duration'
    );
    if (containsDuration) {
      dependencyManager.addDependency('import java.time.Duration;');
    }
    const containsUUID = Object.values(properties).some(
      (prop) => prop.property.options?.format === 'uuid'
    );
    if (containsUUID) {
      dependencyManager.addDependency('import java.util.UUID;');
    }
  }
}
