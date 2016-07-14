import {BaseEmailTemplateDO, EmailTemplateTypes} from './BaseEmailTemplateDO';

export class InvoiceEmailTemplateDO extends BaseEmailTemplateDO {
    constructor() {
        super(EmailTemplateTypes.Invoice);
    }
}