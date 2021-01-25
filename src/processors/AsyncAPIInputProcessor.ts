import { CommonInputModel } from '../models/CommonInputModel';
import { I_InputProcessor } from '../interfaces/I_InputProcessor';
import {parse, AsyncAPIDocument, Schema as AsyncAPISchema} from '@asyncapi/parser';
import { JsonSchemaInputProcessor } from './JsonSchemaInputProcessor';
export class AsyncAPIInputProcessor implements I_InputProcessor {
    /**
     * Process the input as an AsyncAPI document
     * 
     * @param input 
     */
    async process(input: any): Promise<CommonInputModel> {
        var doc: AsyncAPIDocument;
        if(!AsyncAPIInputProcessor.isFromParser(input)){
            doc = await parse(input);
        }else{
            doc = input;
        }
        let common = new CommonInputModel();
        common.originalInput= doc;
        common.models = [];
        doc.allSchemas().forEach((schema: AsyncAPISchema) => {
            common.models = common.models.merge(JsonSchemaInputProcessor.convertSchemaToCommonModel(schema.json()));
        });
        return common;
    }

    /**
     * Figures out if an object is of type AsyncAPI document
     * 
     * @param input 
     */
    static isAsyncAPI(input: any) : boolean {
        if(typeof input === "object"){
            //Check if we got a parsed document from out parser
            if(AsyncAPIInputProcessor.isFromParser(input)){
                return true;
            //Check if we just got provided a pure object
            }else if(input.asyncapi !== undefined){
                return true;
            }
        }
        return false;
    }

    /**
     * Figure out if input is from our parser.
     * 
     * @param input 
     */
    static isFromParser(input: any){
        if(input._json !== undefined && 
            input._json.asyncapi !== undefined && 
            typeof input.version === 'function'){
            return true;
        }
        return false;
    }
}
