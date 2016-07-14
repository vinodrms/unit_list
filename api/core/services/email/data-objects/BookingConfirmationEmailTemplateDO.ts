import {BaseEmailTemplateDO, EmailTemplateTypes} from './BaseEmailTemplateDO';

export class BookingConfirmationEmailTemplateDO extends BaseEmailTemplateDO {
    constructor() {
        super(EmailTemplateTypes.BookingConfirmation);
    }
}