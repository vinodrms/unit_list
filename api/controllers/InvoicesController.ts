import { ThError } from '../core/utils/th-responses/ThError';
import { BaseController } from './base/BaseController';
import { ThStatusCode } from '../core/utils/th-responses/ThResponse';
import { AppContext } from '../core/utils/AppContext';
import { SessionContext } from '../core/utils/SessionContext';
import { SaveInvoice } from "../core/domain-layer/invoices/save-invoice/SaveInvoice";
import { InvoiceDO } from "../core/data-layer/invoices/data-objects/InvoiceDO";
import { InvoiceSearchResultRepoDO } from "../core/data-layer/invoices/repositories/IInvoiceRepository";
import { LazyLoadMetaResponseRepoDO } from "../core/data-layer/common/repo-data-objects/LazyLoadRepoDO";
import { TransferInvoiceItems } from "../core/domain-layer/invoices/transfer-items/TransferInvoiceItems";
import { ReinstateInvoice } from "../core/domain-layer/invoices/reinstate-invoice/ReinstateInvoice";

export class InvoicesController extends BaseController {

    public getInvoiceById(req: any, res: any) {
        if (!this.precheckGETParameters(req, res, ['id'])) { return };

        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;
        var invoiceId: string = req.query.id;

        var invoiceRepo = appContext.getRepositoryFactory().getInvoiceRepository();
        invoiceRepo.getInvoiceById({ hotelId: sessionContext.sessionDO.hotel.id }, invoiceId)
            .then((invoice: InvoiceDO) => {
                this.returnSuccesfulResponse(req, res, invoice);
            }).catch((err: any) => {
                this.returnErrorResponse(req, res, err, ThStatusCode.InvoiceControllerErrorGettingInvoiceById);
            });
    }

    public getInvoiceList(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;
        var invoiceRepo = appContext.getRepositoryFactory().getInvoiceRepository();
        invoiceRepo.getInvoiceList({ hotelId: sessionContext.sessionDO.hotel.id }, req.body.searchCriteria, req.body.lazyLoad)
            .then((result: InvoiceSearchResultRepoDO) => {
                this.returnSuccesfulResponse(req, res, result);
            }).catch((err: any) => {
                this.returnErrorResponse(req, res, err, ThStatusCode.InvoiceControllerErrorGettingInvoices);
            });
    }

    public getInvoiceListCount(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;
        var invoiceRepo = appContext.getRepositoryFactory().getInvoiceRepository();

        invoiceRepo.getInvoiceListCount({ hotelId: sessionContext.sessionDO.hotel.id }, req.body.searchCriteria)
            .then((lazyLoadMeta: LazyLoadMetaResponseRepoDO) => {
                this.returnSuccesfulResponse(req, res, lazyLoadMeta);
            }).catch((err: any) => {
                this.returnErrorResponse(req, res, err, ThStatusCode.InvoiceControllerErrorGettingInvoicesCount);
            });
    }

    public saveInvoice(req: any, res: any) {
        var saveInvoice = new SaveInvoice(req.appContext, req.sessionContext);
        saveInvoice.save(req.body.invoice, req.body.itemTransactionIdListToDelete, req.body.payerCustomerIdListToDelete)
            .then((updatedInvoice: InvoiceDO) => {
                this.returnSuccesfulResponse(req, res, { invoice: updatedInvoice });
            }).catch((err: any) => {
                this.returnErrorResponse(req, res, err, ThStatusCode.InvoicesControllerErrorSavingInvoice);
            });
    }

    public transferItems(req: any, res: any) {
        var transferInvoiceItems = new TransferInvoiceItems(req.appContext, req.sessionContext);
        transferInvoiceItems.transfer(req.body.transferDetails)
            .then((invoiceList: InvoiceDO[]) => {
                this.returnSuccesfulResponse(req, res, { invoiceList: invoiceList });
            }).catch((err: any) => {
                this.returnErrorResponse(req, res, err, ThStatusCode.InvoicesControllerErrorTransferringItems);
            });
    }

    public reinstateInvoice(req: any, res: any) {
        let reinstateInvoice = new ReinstateInvoice(req.appContext, req.sessionContext);

        reinstateInvoice.reinstate(req.body.invoiceId)
            .then((invoiceList: InvoiceDO[]) => {
                this.returnSuccesfulResponse(req, res, { invoiceList: invoiceList });
            }).catch((err: any) => {
                this.returnErrorResponse(req, res, err, ThStatusCode.InvoicesControllerErrorReinstatingInvoice);
            });
    }
}

var invoicesController = new InvoicesController();
module.exports = {
    getInvoiceById: invoicesController.getInvoiceById.bind(invoicesController),
    getInvoiceList: invoicesController.getInvoiceList.bind(invoicesController),
    getInvoiceListCount: invoicesController.getInvoiceListCount.bind(invoicesController),
    saveInvoice: invoicesController.saveInvoice.bind(invoicesController),
    transferItems: invoicesController.transferItems.bind(invoicesController),
    reinstateInvoice: invoicesController.reinstateInvoice.bind(invoicesController),

}
