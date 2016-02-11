import {ISendgridTemplate} from './ISendgridTemplate';
import {BaseEmailTemplateDO, EmailTemplateTypes} from '../../data-objects/BaseEmailTemplateDO';

import {SendgridAccountActivationTemplate} from './templates/SendgridAccountActivationTemplate';
import {SendgridEmptyTemplate} from './templates/SendgridEmptyTemplate';
import {SendgridRequestResetPasswordTemplate} from './templates/SendgridRequestResetPasswordTemplate';
import {SendgridPasswordWasResetTemplate} from './templates/SendgridPasswordWasResetTemplate';

export class SendgridTemplateFactory {
    public getTemplate(emailTemplate: BaseEmailTemplateDO): ISendgridTemplate {
        switch (emailTemplate.getEmailTemplateType()) {
            case EmailTemplateTypes.AccountActivation:
                return new SendgridAccountActivationTemplate(<any>emailTemplate);
			case EmailTemplateTypes.AccountRequestResetPassword:
				return new SendgridRequestResetPasswordTemplate(<any>emailTemplate);
			case EmailTemplateTypes.AccountPasswordWasReset:
				return new SendgridPasswordWasResetTemplate(<any>emailTemplate);
            default:
                return new SendgridEmptyTemplate(emailTemplate);
        }
    }
}