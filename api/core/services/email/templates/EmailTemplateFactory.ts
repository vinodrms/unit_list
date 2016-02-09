import {EmailTemplate} from './EmailTemplate';
import {SendgridAccountActivationTemplate} from './sendgrid/SendgridAccountActivationTemplate';

export class EmailTemplateFactory {
    public static getAccountActivationEmailTemplate(emailTemplateDO: any): EmailTemplate {
        return new SendgridAccountActivationTemplate(emailTemplateDO);            
    }
}