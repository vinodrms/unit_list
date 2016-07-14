import {ISendgridTemplate} from '../ISendgridTemplate';
import {InvoiceEmailTemplateDO} from '../../../data-objects/InvoiceEmailTemplateDO';

export class SendgridInvoiceTemplate implements ISendgridTemplate {
    constructor(private _emailTemplateDO: InvoiceEmailTemplateDO) {
    }

    public getTemplateMetadata(): any {
        return {
            id: 'e0780e69-7acb-4abd-a7c4-67eb0ccf66a9',
            subs: {
                
            }
        };
    }
}