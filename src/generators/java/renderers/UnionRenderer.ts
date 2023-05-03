import { JavaRenderer } from '../JavaRenderer';
import {
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ConstrainedReferenceModel,
  ConstrainedUnionModel
} from '../../../models';
import { JavaOptions } from '../JavaGenerator';
import { UnionPresetType } from '../JavaPreset';
import { FormatHelpers } from '../../../index';

/**
 * Renderer for Java's `union` type
 *
 * @extends JavaRenderer
 */
export class UnionRenderer extends JavaRenderer<ConstrainedUnionModel> {
  async defaultSelf(): Promise<string> {
    const doc = this.renderComments(
      `${this.model.name} represents a union of types: ${this.model.union
        .map((m) => m.type)
        .join(', ')}`
    );

    const content = [];

    for (const p of this.commonProperties()) {
      content.push(await this.runGetterPreset(p));
      content.push(await this.runSetterPreset(p));
    }

    content.push(await this.runAdditionalContentPreset());

    return this.renderBlock([
      doc,
      `public interface ${this.model.name} {`,
      this.indent(this.renderBlock(content)),
      '}'
    ]);
  }

  commonProperties(): ConstrainedObjectPropertyModel[] {
    // get all the union members with properties
    const objectUnions = this.model.union.flatMap((u) => {
      if (
        u instanceof ConstrainedReferenceModel &&
        u.ref instanceof ConstrainedObjectModel
      ) {
        return [u.ref];
      } else if (u instanceof ConstrainedObjectModel) {
        return [u];
      }

      return [];
    });

    if (objectUnions.length === 0) {
      return [];
    }

    // take the first objects properties
    let properties = Object.values(objectUnions[0].properties);

    // and filter out any properties not shared by other union types
    for (const u of objectUnions.slice(1)) {
      properties = properties.filter((p) =>
        Object.values(u.properties).some(
          (v) =>
            v.propertyName === p.propertyName &&
            v.property.type === p.property.type
        )
      );
    }

    return properties;
  }

  runGetterPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('getter', { property });
  }

  runSetterPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('setter', { property });
  }
}

export const JAVA_DEFAULT_UNION_PRESET: UnionPresetType<JavaOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  getter({ property }) {
    const getterName = `get${FormatHelpers.toPascalCase(
      property.propertyName
    )}`;
    return `${property.property.type} ${getterName}();`;
  },
  setter({ property }) {
    if (property.property.options.const?.value) {
      return '';
    }
    const setterName = FormatHelpers.toPascalCase(property.propertyName);
    return `void set${setterName}(${property.property.type} ${property.propertyName});`;
  }
};
