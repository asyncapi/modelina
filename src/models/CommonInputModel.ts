import { CommonModel } from './CommonModel';
import { Schema } from './Schema'; 

export class CommonInputModel {
    models: CommonModel[] = [];
    customizations: Object = {};
    originalSchema: any = {};
}