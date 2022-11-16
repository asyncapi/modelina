import { AbstractGenerator } from '../AbstractGenerator';
import {
    ConstrainedMetaModel,
    ConstrainedStringModel,
    InputMetaModel,
    MetaModel,
    RenderOutput
} from '../../models';

export class PhpGenerator extends AbstractGenerator {
    constrainToMetaModel(model: MetaModel): ConstrainedMetaModel {
        return new ConstrainedStringModel('name', {}, 'type');
    }

    render(model: MetaModel, inputModel: InputMetaModel): Promise<RenderOutput> {
        return Promise.resolve(RenderOutput.toRenderOutput({ result: '', renderedName: 'false' }));
    }

    renderCompleteModel(model: MetaModel, inputModel: InputMetaModel, options: any): Promise<RenderOutput> {
        return Promise.resolve(RenderOutput.toRenderOutput({ result: '', renderedName: 'false' }));
    }

    splitMetaModel(model: MetaModel): MetaModel[] {
        return [];
    }
}
