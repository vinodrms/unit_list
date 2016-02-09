import {ISendgridTemplate} from './ISendgridTemplate';
import {BaseEmailTemplateDO, EmailTemplateTypes} from '../../data-objects/BaseEmailTemplateDO';

import {SendgridAccountActivationTemplate} from './templates/SendgridAccountActivationTemplate';
import {SendgridEmptyTemplate} from './templates/SendgridEmptyTemplate';

export class SendgridTemplateFactory {
    public getTemplate(emailTemplate: BaseEmailTemplateDO): ISendgridTemplate {
        switch (emailTemplate.emailTemplateType) {
            case EmailTemplateTypes.AccountActivation:
                return new SendgridAccountActivationTemplate(<any>emailTemplate);
            default:
                return new SendgridEmptyTemplate(emailTemplate);
        }
    }
}