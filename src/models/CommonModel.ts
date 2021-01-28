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
        newCommonModel = CommonSchema.transformSchema(newCommonModel, object, CommonModel.toCommonModel);
        if(newCommonModel.originalSchema !== undefined){
            newCommonModel.originalSchema = Schema.toSchema(newCommonModel.originalSchema);
        }
        return newCommonModel;
    }


    /**
     * 
     * Only merge if left side is undefined and right side is sat OR both sides are defined
     * 
     * @param mergeTo 
     * @param mergeFrom 
     */
    static mergeCommonModels(mergeTo: CommonModel, mergeFrom: CommonModel) : CommonModel {     
        if(mergeTo.properties === undefined && mergeFrom.properties !== undefined){
            mergeTo.properties = mergeFrom.properties;
        } else if(mergeTo.items !== undefined && mergeFrom.properties !== undefined) {
            mergeTo.properties = {...mergeTo.properties, ...mergeFrom.properties};
        }
        if(mergeTo.items === undefined && mergeFrom.items !== undefined){
            mergeTo.items = mergeFrom.items;
        } else if(mergeTo.items !== undefined && mergeFrom.items !== undefined) {
            mergeTo.items = {...mergeTo.items, ...mergeFrom.items};
        }
        if(mergeTo.enum === undefined && mergeFrom.enum !== undefined){
            mergeTo.enum = mergeFrom.enum;
        } else if(mergeTo.items !== undefined && mergeFrom.enum !== undefined) {
            mergeTo.enum = {...mergeTo.enum, ...mergeFrom.enum};
        }
        if(mergeTo.type === undefined && mergeFrom.type !== undefined){
            mergeTo.type = mergeFrom.type;
        } else if(mergeTo.items !== undefined && mergeFrom.type !== undefined) {
            if(!Array.isArray(mergeTo.type)){
                mergeTo.type = [mergeTo.type!]; 
            }
            if(!Array.isArray(mergeFrom.type)){
                mergeFrom.type = [mergeFrom.type!]; 
            }
            mergeTo.type = [...mergeTo.type, ...mergeFrom.type];
        }
        mergeTo.$id = mergeFrom.$id;
        mergeTo.$ref = mergeFrom.$ref;
        mergeTo.extend = mergeFrom.extend;
        return mergeTo;
    }
}