import {ISendgridTemplate} from '../ISendgridTemplate';
import {BookingConfirmationTemplateDO} from '../../../data-objects/BookingConfirmationTemplateDO';

export class SendgridBookingConfirmationTemplate implements ISendgridTemplate {
    constructor(private _emailTemplateDO: BookingConfirmationTemplateDO) {
    }

    public getTemplateMetadata(): any {
        return {
            id: '48e0b815-3311-4df9-bf74-93d80a63bce8',
            subs: {
                
            }
        };
    }
}