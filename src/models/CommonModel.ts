import { CommonSchema } from "./CommonSchema";
import { Schema } from "./Schema";

/**
 * Common representation for the renderers.
 * 
 * @extends CommonSchema<CommonModel>
 */
export class CommonModel extends CommonSchema<CommonModel>{
    extend?: string
    originalSchema?: Schema

    /**
     * Transform object into a type of CommonModel.
     * 
     * @param object to transform
     * @returns CommonModel instance of the object
     */
    static toCommonModel(object: Object) : CommonModel{
        let newCommonModel = new CommonModel();
        newCommonModel = Object.assign(newCommonModel, object);
        newCommonModel = CommonSchema.transformSchema(newCommonModel, CommonModel.toCommonModel);
        if(newCommonModel.originalSchema !== undefined){
            newCommonModel.originalSchema = Schema.toSchema(newCommonModel.originalSchema);
        }
        return newCommonModel;
    }


    /**
     * Only merge if left side is undefined and right side is sat OR both sides are defined
     * 
     * @param mergeTo CommonModel to merge into
     * @param mergeFrom CommonModel to merge values from
     */
    static mergeCommonModels(mergeTo: CommonModel | undefined, mergeFrom: CommonModel, originalSchema: Schema) : CommonModel {
        if(mergeTo === undefined) return mergeFrom;
        const mergeToProperties = mergeTo.properties;
        const mergeFromProperties = mergeFrom.properties;
        if(mergeFromProperties !== undefined){
            if(mergeToProperties === undefined){
                mergeTo.properties = mergeFromProperties;
            } else {
                Object.entries(mergeFromProperties).forEach(([propName, prop])=> {
                    if(mergeToProperties![propName] !== undefined){
                      mergeTo.properties![propName] = CommonModel.mergeCommonModels(mergeToProperties![propName], prop, originalSchema);
                    } else {
                      mergeTo.properties![propName] = prop;
                    }
                });
            }
        }


        const mergeItems = (models: CommonModel | CommonModel[] | undefined) : CommonModel | undefined => {
            if(Array.isArray(models)){
                if(models.length > 0){
                    let mergedItemsModel : CommonModel = models[0];
                    models.forEach((model) => {mergedItemsModel = CommonModel.mergeCommonModels(mergedItemsModel, model, originalSchema);});
                    return mergedItemsModel;
                } else {
                    return undefined;
                }
            }
            return models;
        };
        if(mergeFrom.items !== undefined){
            //Incase of arrays, merge them into a single schema
            let mergeFromItemsModel = mergeItems(mergeFrom.items);
            let mergeToItemsModel = mergeItems(mergeTo.items);
            if(mergeFromItemsModel !== undefined){
                if(mergeToItemsModel !== undefined){
                    mergeTo.items = CommonModel.mergeCommonModels(mergeToItemsModel, mergeFromItemsModel, originalSchema);
                }else{
                    mergeTo.items = mergeFromItemsModel;
                }
            }
        }else if(mergeTo.items !== undefined){
            mergeTo.items = mergeItems(mergeTo.items);
        }


        if(mergeFrom.enum !== undefined){
            if(mergeTo.enum === undefined){
                mergeTo.enum = mergeFrom.enum;
            } else {
                mergeTo.enum = [...mergeTo.enum, ...mergeFrom.enum];
            }
        }

        if(mergeFrom.type !== undefined){
            if(mergeTo.type === undefined){
                mergeTo.type = mergeFrom.type;
            } else {
                //Only add the types that do not already exist
                const addToType = (type : string) => {
                    if(!mergeTo.type!.includes(type)){
                        if(Array.isArray(mergeTo.type)){
                            mergeTo.type.push(type);
                        }else{
                            mergeTo.type = [mergeTo.type!, type];
                        }
                    }
                }
                if(Array.isArray(mergeFrom.type)){
                    mergeFrom.type.forEach(addToType);
                }else{
                    addToType(mergeFrom.type);
                }
            }
        }
        // Which values are correct to use here? Is allOf required?
        if(mergeFrom.$id !== undefined){
            mergeTo.$id = mergeFrom.$id;
        }
        if(mergeFrom.$ref !== undefined){
            mergeTo.$ref = mergeFrom.$ref;
        }
        if(mergeFrom.extend !== undefined){
            mergeTo.extend = mergeFrom.extend;
        }
        mergeTo.originalSchema = originalSchema;
        return mergeTo;
    }
}