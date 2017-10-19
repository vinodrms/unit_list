import { ThError } from '../core/utils/th-responses/ThError';
import { BaseController } from './base/BaseController';
import { ThStatusCode } from '../core/utils/th-responses/ThResponse';
import { AppContext } from '../core/utils/AppContext';
import { SessionContext, SessionDO } from '../core/utils/SessionContext';
import { SaveInvoice } from "../core/domain-layer/invoices/save-invoice/SaveInvoice";
import { InvoiceDO } from "../core/data-layer/invoices/data-objects/InvoiceDO";
import { InvoiceSearchResultRepoDO } from "../core/data-layer/invoices/repositories/IInvoiceRepository";
import { LazyLoadMetaResponseRepoDO } from "../core/data-layer/common/repo-data-objects/LazyLoadRepoDO";
import { ThTranslation } from "../core/utils/localization/ThTranslation";
import { ReportType, PdfReportsServiceResponse } from "../core/services/pdf-reports/IPdfReportsService";
import { InvoiceDataAggregator, InvoiceDataAggregatorQuery } from "../core/domain-layer/invoices/aggregators/InvoiceDataAggregator";
import { InvoiceAggregatedData } from "../core/domain-layer/invoices/aggregators/InvoiceAggregatedData";
import { InvoiceConfirmationVMContainer } from "../core/domain-layer/invoices/invoice-confirmations/InvoiceConfirmationVMContainer";
import { ITokenService } from "../core/domain-layer/token/ITokenService";
import { IUser } from "../core/bootstrap/oauth/OAuthServerInitializer";
import { TransferInvoiceItems } from "../core/domain-layer/invoices/transfer-items/TransferInvoiceItems";
import { ReinstateInvoice } from "../core/domain-layer/invoices/reinstate-invoice/ReinstateInvoice";
import { DeleteInvoice } from "../core/domain-layer/invoices/delete-invoice/DeleteInvoice";

import _ = require('underscore');

export class InvoicesController extends BaseController {

    public getInvoiceById(req: any, res: any) {
        if (!this.precheckGETParameters(req, res, ['id'])) { return };

        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;
        var invoiceId: string = req.query.id;

        var invoiceRepo = appContext.getRepositoryFactory().getInvoiceRepository();
        invoiceRepo.getInvoiceById({ hotelId: sessionContext.sessionDO.hotel.id }, invoiceId)
            .then((invoice: InvoiceDO) => {
                this.translateInvoiceHistory(invoice, this.getThTranslation(sessionContext));
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
                this.translateInvoiceListHistory(result.invoiceList, sessionContext);
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
                this.translateInvoiceHistory(updatedInvoice, req.sessionContext);
                this.returnSuccesfulResponse(req, res, { invoice: updatedInvoice });
            }).catch((err: any) => {
                this.returnErrorResponse(req, res, err, ThStatusCode.InvoicesControllerErrorSavingInvoice);
            });
    }
    public downloadInvoicePdf(req: any, res: any) {
        let pdfReportsService = req.appContext.getServiceFactory().getPdfReportsService();
        let thTranslation = new ThTranslation(req.sessionContext.language);
        let tokenService: ITokenService = req.appContext.getServiceFactory().getTokenService();
        let generatedPdfAbsolutePath: string;

        tokenService.getUserInfoByAccessToken(req.query['token']).then((userInfo: IUser) => {
            let sessionDO: SessionDO = new SessionDO();
            sessionDO.buildFromUserInfo(userInfo);
            req.sessionContext.sessionDO = sessionDO;


            let invoiceDataAggregator = new InvoiceDataAggregator(req.appContext, req.sessionContext);

            let query: InvoiceDataAggregatorQuery = {
                customerId: req.query['customerId'],
                invoiceId: req.query['invoiceId'],
            };

            return invoiceDataAggregator.getInvoiceAggregatedData(query);
        }).then((invoiceAggregatedData: InvoiceAggregatedData) => {
            var invoiceConfirmationVMContainer = new InvoiceConfirmationVMContainer(thTranslation);
            invoiceConfirmationVMContainer.buildFromInvoiceAggregatedDataContainer(invoiceAggregatedData);

            return pdfReportsService.generatePdfReport({
                reportType: ReportType.Invoice,
                reportData: invoiceConfirmationVMContainer,
                settings: {

                }
            })
        }).then((result: PdfReportsServiceResponse) => {
            generatedPdfAbsolutePath = result.pdfPath;

            res.download(generatedPdfAbsolutePath, (err) => {
                let fileService = (<AppContext>req.appContext).getServiceFactory().getFileService();
                fileService.deleteFile(generatedPdfAbsolutePath);
            });
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.InvoiceGroupsControllerErrorDownloading);
        });
    }

    public transferItems(req: any, res: any) {
        var transferInvoiceItems = new TransferInvoiceItems(req.appContext, req.sessionContext);
        transferInvoiceItems.transfer(req.body.transferDetails)
            .then((invoiceList: InvoiceDO[]) => {
                this.translateInvoiceListHistory(invoiceList, req.sessionContext);
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

    public deleteInvoice(req: any, res: any) {
        let deleteInvoice = new DeleteInvoice(req.appContext, req.sessionContext);

        deleteInvoice.delete(req.body.invoiceId)
            .then((invoice: InvoiceDO) => {
                this.returnSuccesfulResponse(req, res, invoice);
            }).catch((err: any) => {
                this.returnErrorResponse(req, res, err, ThStatusCode.InvoiceControllerErrorDeletingInvoice);
            });
    }

    private translateInvoiceListHistory(invoiceList: InvoiceDO[], sessionContext: SessionContext) {
        var thTranslation = this.getThTranslation(sessionContext);
        _.forEach(invoiceList, (invoice: InvoiceDO) => {
            this.translateInvoiceHistory(invoice, thTranslation);
        });
    }
    private translateInvoiceHistory(invoice: InvoiceDO, thTranslation: ThTranslation) {
        invoice.history.translateActions(thTranslation);
    }
}


var invoicesController = new InvoicesController();
module.exports = {
    getInvoiceById: invoicesController.getInvoiceById.bind(invoicesController),
    getInvoiceList: invoicesController.getInvoiceList.bind(invoicesController),
    getInvoiceListCount: invoicesController.getInvoiceListCount.bind(invoicesController),
    saveInvoice: invoicesController.saveInvoice.bind(invoicesController),
    downloadInvoicePdf: invoicesController.downloadInvoicePdf.bind(invoicesController),
    transferItems: invoicesController.transferItems.bind(invoicesController),
    reinstateInvoice: invoicesController.reinstateInvoice.bind(invoicesController),
    deleteInvoice: invoicesController.deleteInvoice.bind(invoicesController),

}
