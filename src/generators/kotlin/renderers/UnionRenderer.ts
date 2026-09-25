import { FormatHelpers } from '../../../helpers';
import {
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedReferenceModel,
  ConstrainedUnionModel
} from '../../../models';
import { KotlinOptions } from '../KotlinGenerator';
import { UnionPresetType } from '../KotlinPreset';
import { KotlinRenderer } from '../KotlinRenderer';

/** Renderer for Kotlin sealed interfaces that represent object unions. */
export class UnionRenderer extends KotlinRenderer<ConstrainedUnionModel> {
  async defaultSelf(): Promise<string> {
    const content: string[] = [];
    const discriminator = this.model.options.discriminator;
    if (discriminator?.type) {
      const propertyName = FormatHelpers.toCamelCase(
        FormatHelpers.replaceSpecialCharacters(discriminator.discriminator, {
          exclude: ['_'],
          separator: '_'
        })
      );
      const overridesSharedBase = getSharedPolymorphicBase(this.model)
        ? 'override '
        : '';
      content.push(
        `${overridesSharedBase}val ${propertyName}: ${discriminator.type}`
      );
    }
    content.push(await this.runAdditionalContentPreset());

    const sharedBase = getSharedPolymorphicBase(this.model);
    const inheritance = sharedBase ? ` : ${sharedBase.name}` : '';
    const body = this.renderBlock(content);
    if (!body) {
      return `sealed interface ${this.model.name}${inheritance}`;
    }
    return `sealed interface ${this.model.name}${inheritance} {
${this.indent(body)}
}`;
  }
}

export function getSharedPolymorphicBase(
  model: ConstrainedUnionModel
): ConstrainedObjectModel | undefined {
  const discriminator = model.options.discriminator?.discriminator;
  const members = model.union
    .map(resolveModel)
    .filter(
      (member): member is ConstrainedObjectModel =>
        member instanceof ConstrainedObjectModel
    );
  if (
    !discriminator ||
    members.length !== model.union.length ||
    !members.length
  ) {
    return undefined;
  }

  const candidates = extendedObjectModels(members[0]).filter(
    (candidate) => discriminatorName(candidate) === discriminator
  );
  const sharedCandidates = candidates.filter((candidate) =>
    members.every((member) =>
      extendedObjectModels(member).some(
        (extended) => extended.name === candidate.name
      )
    )
  );
  return sharedCandidates.length === 1 ? sharedCandidates[0] : undefined;
}

function extendedObjectModels(
  model: ConstrainedObjectModel
): ConstrainedObjectModel[] {
  return (model.options.extend || [])
    .map(resolveModel)
    .filter(
      (extended): extended is ConstrainedObjectModel =>
        extended instanceof ConstrainedObjectModel
    );
}

function resolveModel(model: ConstrainedMetaModel): ConstrainedMetaModel {
  return model instanceof ConstrainedReferenceModel ? model.ref : model;
}

function discriminatorName(model: ConstrainedObjectModel): string | undefined {
  const discriminator =
    model.options.discriminator?.discriminator ||
    model.originalInput?.discriminator;
  return typeof discriminator === 'string' ? discriminator : undefined;
}

export const KOTLIN_DEFAULT_UNION_PRESET: UnionPresetType<KotlinOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  }
};
