import { ThUtils } from '../../../../utils/ThUtils';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ISaveInvoiceActionStrategy } from './ISaveInvoiceActionStrategy';
import { InvoiceDO } from "../../../../data-layer/invoices/data-objects/InvoiceDO";
import { InvoiceAddStrategy } from "./strategies/InvoiceAddStrategy";
import { InvoiceUpdateStrategy } from "./strategies/InvoiceUpdateStrategy";

export class SaveInvoiceActionFactory {
    private thUtils: ThUtils;

    constructor(private appContext: AppContext, private sessionContext: SessionContext) {
        this.thUtils = new ThUtils();
    }

    public getActionStrategy(invoice: InvoiceDO, itemTransactionIdListToDelete: string[],
        payerCustomerIdListToDelete: string[]): ISaveInvoiceActionStrategy {
        if (!this.thUtils.isUndefinedOrNull(invoice.id)) {
            return new InvoiceUpdateStrategy(this.appContext, this.sessionContext, invoice,
                itemTransactionIdListToDelete, payerCustomerIdListToDelete);
        }
        return new InvoiceAddStrategy(this.appContext, this.sessionContext, invoice);
    }
}
