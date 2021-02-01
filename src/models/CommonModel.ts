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
    static mergeCommonModels(mergeTo: CommonModel, mergeFrom: CommonModel, originalSchema: Schema) : CommonModel {
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
        if(mergeFrom.items !== undefined){
            if(mergeTo.items === undefined){
                mergeTo.items = mergeFrom.items;
            } else {
                if(!Array.isArray(mergeFrom.items)){
                    mergeFrom.items = [mergeFrom.items];
                }
                if(!Array.isArray(mergeTo.items)){
                    mergeTo.items = [mergeTo.items];
                }
                mergeFrom.items.forEach((value, index) => {
                    const mergeToItems = mergeTo.items as CommonModel[];
                    if(mergeToItems[index] !== undefined){
                        mergeToItems[index] = CommonModel.mergeCommonModels(mergeToItems[index], value, originalSchema);
                    }else{
                        mergeToItems[index] = value;
                    }
                });
            }
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
                if(!Array.isArray(mergeTo.type)){
                    mergeTo.type = [mergeTo.type!]; 
                }
                if(!Array.isArray(mergeFrom.type)){
                    mergeFrom.type = [mergeFrom.type!]; 
                }
                mergeTo.type = [...mergeTo.type, ...mergeFrom.type];
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