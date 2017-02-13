import {ISendgridTemplate} from '../ISendgridTemplate';
import {InvoiceEmailTemplateDO} from '../../../data-objects/InvoiceEmailTemplateDO';

export class SendgridInvoiceTemplate implements ISendgridTemplate {
    constructor(private _emailTemplateDO: InvoiceEmailTemplateDO) {
    }

    public getTemplateMetadata(): any {
        return {
            id: '995db70f-5c6c-4ea6-98be-558cfbd26239',
            subs: {
                
            }
        };
    }
}