import {ISendgridTemplate} from '../ISendgridTemplate';
import {BaseEmailTemplateDO} from '../../../data-objects/BaseEmailTemplateDO';

export class SendgridEmptyTemplate implements ISendgridTemplate {
    constructor(private _emailTemplateDO: BaseEmailTemplateDO) {
    }

    public getTemplateMetadata(): any {
        return {
        };
    }
}