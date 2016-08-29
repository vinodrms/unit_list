import {ISendgridTemplate} from '../ISendgridTemplate';
import {BookingConfirmationEmailTemplateDO} from '../../../data-objects/BookingConfirmationEmailTemplateDO';

export class SendgridBookingConfirmationTemplate implements ISendgridTemplate {
    constructor(private _emailTemplateDO: BookingConfirmationEmailTemplateDO) {
    }

    public getTemplateMetadata(): any {
        return {
            id: '48e0b815-3311-4df9-bf74-93d80a63bce8',
            subs: {
                
            }
        };
    }
}