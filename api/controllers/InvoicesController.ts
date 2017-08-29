import { ThError } from '../core/utils/th-responses/ThError';
import { BaseController } from './base/BaseController';
import { ThStatusCode } from '../core/utils/th-responses/ThResponse';
import { AppContext } from '../core/utils/AppContext';
import { SessionContext } from '../core/utils/SessionContext';
import { SaveInvoice } from "../core/domain-layer/invoices/save-invoice/SaveInvoice";
import { InvoiceDO } from "../core/data-layer/invoices/data-objects/InvoiceDO";

export class InvoicesController extends BaseController {

    public saveInvoice(req: any, res: any) {
        var saveInvoice = new SaveInvoice(req.appContext, req.sessionContext);
        saveInvoice.save(req.body.invoice, req.body.itemTransactionIdListToDelete, req.body.payerCustomerIdListToDelete)
            .then((updatedInvoice: InvoiceDO) => {
                this.returnSuccesfulResponse(req, res, { invoice: updatedInvoice });
            }).catch((err: any) => {
                this.returnErrorResponse(req, res, err, ThStatusCode.InvoicesControllerErrorSavingInvoice);
            });
    }

}

var invoicesController = new InvoicesController();
module.exports = {
    saveInvoice: invoicesController.saveInvoice.bind(invoicesController),
}
