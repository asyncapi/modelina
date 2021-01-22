import { CommonSchema } from "./CommonSchema";
import { Schema } from "./Schema";

/**
 * Common representation for the renderers.
 * @extends CommonSchema<CommonModel>
 */
export class CommonModel extends CommonSchema<CommonModel>{
    "x-extend"?: string
    "x-original-schema"?: Schema

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
        if(newCommonModel["x-original-schema"] !== undefined){
            newCommonModel["x-original-schema"] = Schema.toSchema(newCommonModel["x-original-schema"]);
        }
        return newCommonModel;
    }
}