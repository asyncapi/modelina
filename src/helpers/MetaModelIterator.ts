// import {
//   ConstrainedArrayModel,
//   ConstrainedDictionaryModel,
//   ConstrainedMetaModel,
//   ConstrainedObjectModel,
//   ConstrainedObjectPropertyModel,
//   ConstrainedReferenceModel,
//   ConstrainedTupleModel,
//   ConstrainedUnionModel
// } from '../models';

// export type callbackType = (argument: {
//   partOfProperty: ConstrainedObjectPropertyModel;
//   constrainedModel: ConstrainedMetaModel;
//   parentConstrainedModel: ConstrainedMetaModel;
//   context: any;
// }) => { continue: boolean };

// function iterateMetaModel({
//   callback,
//   constrainedModel,
//   context
// }: {
//   constrainedModel: ConstrainedMetaModel;
//   callback: callbackType;
//   context: any;
// }) {
//   if (constrainedModel instanceof ConstrainedObjectModel) {
//     for (const propertyModel of Object.values({
//       ...constrainedModel.properties
//     })) {
//       const returnType = callback({
//         constrainedModel: propertyModel.property,
//         parentConstrainedModel: constrainedModel,
//         partOfProperty: propertyModel,
//         context
//       });
//       if (returnType.continue) {
//         iterateMetaModel({
//           callback,
//           constrainedModel: propertyModel.property,
//           context
//         });
//       }
//     }
//   } else if (constrainedModel instanceof ConstrainedDictionaryModel) {
//   } else if (constrainedModel instanceof ConstrainedTupleModel) {
//     walkTupleNode(context);
//   } else if (constrainedModel instanceof ConstrainedArrayModel) {
//     walkArrayNode(context);
//   } else if (constrainedModel instanceof ConstrainedUnionModel) {
//     walkUnionNode(context);
//   } else if (constrainedModel instanceof ConstrainedReferenceModel) {
//     walkReferenceNode(context);
//   }
// }

// function walkDictionaryNode<
//   GeneratorOptions,
//   DependencyManager extends AbstractDependencyManager
// >(context: ApplyingTypesOptions<GeneratorOptions, DependencyManager>) {
//   const dictionaryModel =
//     context.constrainedModel as ConstrainedDictionaryModel;

//   const overwriteKeyModel = applyTypes({
//     ...context,
//     constrainedModel: dictionaryModel.key,
//     partOfProperty: undefined
//   });
//   if (overwriteKeyModel) {
//     dictionaryModel.key = overwriteKeyModel;
//   }
//   const overWriteValueModel = applyTypes({
//     ...context,
//     constrainedModel: dictionaryModel.value,
//     partOfProperty: undefined
//   });
//   if (overWriteValueModel) {
//     dictionaryModel.value = overWriteValueModel;
//   }
// }
// function walkTupleNode<
//   GeneratorOptions,
//   DependencyManager extends AbstractDependencyManager
// >(context: ApplyingTypesOptions<GeneratorOptions, DependencyManager>) {
//   const tupleModel = context.constrainedModel as ConstrainedTupleModel;

//   for (const [index, tupleMetaModel] of [...tupleModel.tuple].entries()) {
//     const overwriteTupleModel = applyTypes({
//       ...context,
//       constrainedModel: tupleMetaModel.value,
//       partOfProperty: undefined
//     });
//     if (overwriteTupleModel) {
//       // eslint-disable-next-line security/detect-object-injection
//       tupleModel.tuple[index].value = overwriteTupleModel;
//     }
//   }
// }

// function walkArrayNode<
//   GeneratorOptions,
//   DependencyManager extends AbstractDependencyManager
// >(context: ApplyingTypesOptions<GeneratorOptions, DependencyManager>) {
//   const arrayModel = context.constrainedModel as ConstrainedArrayModel;
//   const overWriteArrayModel = applyTypes({
//     ...context,
//     constrainedModel: arrayModel.valueModel,
//     partOfProperty: undefined,
//     shouldWalkNode: true
//   });

//   if (overWriteArrayModel) {
//     arrayModel.valueModel = overWriteArrayModel;
//   }
// }

// function walkUnionNode<
//   GeneratorOptions,
//   DependencyManager extends AbstractDependencyManager
// >(context: ApplyingTypesOptions<GeneratorOptions, DependencyManager>) {
//   const unionModel = context.constrainedModel as ConstrainedUnionModel;
//   //If all union value models have type, we can go ahead and get the type for the union as well.
//   for (const [index, unionValueModel] of [...unionModel.union].entries()) {
//     const overwriteUnionModel = applyTypes({
//       ...context,
//       constrainedModel: unionValueModel,
//       partOfProperty: undefined,
//       shouldWalkNode: true
//     });

//     if (overwriteUnionModel) {
//       // eslint-disable-next-line security/detect-object-injection
//       unionModel.union[index] = overwriteUnionModel;
//     }
//   }
// }

// function walkReferenceNode<
//   GeneratorOptions,
//   DependencyManager extends AbstractDependencyManager
// >(context: ApplyingTypesOptions<GeneratorOptions, DependencyManager>) {
//   const referenceModel = context.constrainedModel as ConstrainedReferenceModel;
//   const overwriteReference = applyTypes({
//     ...context,
//     constrainedModel: referenceModel.ref,
//     partOfProperty: undefined
//   });

//   if (overwriteReference) {
//     referenceModel.ref = overwriteReference;
//   }
// }
