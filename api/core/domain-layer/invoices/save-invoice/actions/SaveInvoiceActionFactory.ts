import { ThUtils } from '../../../../utils/ThUtils';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ISaveInvoiceActionStrategy } from './ISaveInvoiceActionStrategy';
import { InvoiceDO } from "../../../../data-layer/invoices/data-objects/InvoiceDO";
import { InvoiceAddStrategy } from "./strategies/InvoiceAddStrategy";

export class SaveInvoiceActionFactory {
    private thUtils: ThUtils;

    constructor(private appContext: AppContext, private sessionContext: SessionContext) {
        this.thUtils = new ThUtils();
    }

    public getActionStrategy(invoice: InvoiceDO): ISaveInvoiceActionStrategy {
        if (!this.thUtils.isUndefinedOrNull(invoice.id)) {
            // TODO: create update invoice strategy
            return null;
        }
        return new InvoiceAddStrategy(this.appContext, this.sessionContext, invoice);
    }
}
