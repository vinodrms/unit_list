import { ThError } from '../core/utils/th-responses/ThError';
import { BaseController } from './base/BaseController';
import { ThStatusCode } from '../core/utils/th-responses/ThResponse';
import { AppContext } from '../core/utils/AppContext';
import { SessionContext } from '../core/utils/SessionContext';
import { ThTranslation } from '../core/utils/localization/ThTranslation';
import { InvoiceGroupMetaRepoDO, InvoiceGroupSearchCriteriaRepoDO } from '../core/data-layer/invoices/repositories/IInvoiceGroupsRepository';
import { InvoiceGroupDO } from '../core/data-layer/invoices/data-objects/InvoiceGroupDO';
import { InvoiceDO } from '../core/data-layer/invoices/data-objects/InvoiceDO';
import { LazyLoadRepoDO, LazyLoadMetaResponseRepoDO } from '../core/data-layer/common/repo-data-objects/LazyLoadRepoDO';
import { SaveInvoiceGroup } from '../core/domain-layer/invoices/save-invoice-group/SaveInvoiceGroup';
import { InvoiceDataAggregator, InvoiceDataAggregatorQuery } from '../core/domain-layer/invoices/aggregators/InvoiceDataAggregator';
import { InvoiceAggregatedData } from '../core/domain-layer/invoices/aggregators/InvoiceAggregatedData';
import { InvoiceConfirmationVMContainer } from '../core/domain-layer/invoices/invoice-confirmations/InvoiceConfirmationVMContainer';
import { ReportType, PdfReportsServiceResponse } from '../core/services/pdf-reports/IPdfReportsService';
import { GenerateCreditInvoice } from "../core/domain-layer/invoices/generate-credit-invoice/GenerateCreditInvoice";
import { ReinstateInvoice } from "../core/domain-layer/invoices/reinstate-invoice/ReinstateInvoice";

import path = require("path");

export class InvoiceGroupsController extends BaseController {

    public getInvoiceGroupById(req: Express.Request, res: Express.Response) {
        if (!this.precheckGETParameters(req, res, ['id'])) { return };

        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;
        var invoiceGroupId = req.query.id;
        var invoiceGroupMeta = this.getInvoiceGroupMetaRepoDOFrom(sessionContext);
        var invoiceGroupRepo = appContext.getRepositoryFactory().getInvoiceGroupsRepository();

        invoiceGroupRepo.getInvoiceGroupById(this.getInvoiceGroupMetaRepoDOFrom(sessionContext), invoiceGroupId).then((invoiceGroup: InvoiceGroupDO) => {
            this.returnSuccesfulResponse(req, res, invoiceGroup);
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.InvoiceGroupsControllerErrorGettingInvoiceGroupById);
        });
    }

    public getInvoiceGroupList(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;
        var invoiceGroupMeta = this.getInvoiceGroupMetaRepoDOFrom(sessionContext);
        var invoiceGroupRepo = appContext.getRepositoryFactory().getInvoiceGroupsRepository();

        invoiceGroupRepo.getInvoiceGroupList(invoiceGroupMeta, req.body.searchCriteria, req.body.lazyLoad).then((result: InvoiceGroupSearchCriteriaRepoDO) => {
            this.returnSuccesfulResponse(req, res, result);
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.InvoiceGroupsControllerErrorGettingInvoiceGroups);
        });
    }

    public getInvoiceGroupListCount(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;
        var invoiceGroupMeta = this.getInvoiceGroupMetaRepoDOFrom(sessionContext);
        var invoiceGroupRepo = appContext.getRepositoryFactory().getInvoiceGroupsRepository();

        invoiceGroupRepo.getInvoiceGroupListCount(invoiceGroupMeta, req.body.searchCriteria).then((lazyLoadMeta: LazyLoadMetaResponseRepoDO) => {
            this.returnSuccesfulResponse(req, res, lazyLoadMeta);
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.InvoiceGroupsControllerErrorGettingInvoiceGroupsCount);
        });
    }

    private getInvoiceGroupMetaRepoDOFrom(sessionContext: SessionContext): InvoiceGroupMetaRepoDO {
        return { hotelId: sessionContext.sessionDO.hotel.id };
    }

    public saveInvoiceGroupItem(req: Express.Request, res: Express.Response) {
        var saveInvoiceGroup = new SaveInvoiceGroup(req.appContext, req.sessionContext);

        saveInvoiceGroup.save(req.body.invoiceGroup).then((updatedInvoiceGroup: InvoiceGroupDO) => {
            this.returnSuccesfulResponse(req, res, { invoiceGroup: updatedInvoiceGroup });
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.InvoiceGroupsControllerErrorsavingInvoiceGroup);
        });
    }

    public generateCreditInvoice(req: Express.Request, res: Express.Response) {
        let creditInvoiceGenerator = new GenerateCreditInvoice(req.appContext, req.sessionContext);
        
        creditInvoiceGenerator.generate(req.body.creditedInvoiceMeta).then((updatedInvoiceGroup: InvoiceGroupDO) => {
            this.returnSuccesfulResponse(req, res, { invoiceGroup: updatedInvoiceGroup });
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.InvoiceGroupsControllerErrorsavingInvoiceGroup);
        });
    }

    public reinstateInvoice(req: Express.Request, res: Express.Response) {
        debugger
        let reinstatementInvoiceGenerator = new ReinstateInvoice(req.appContext, req.sessionContext);
        
        reinstatementInvoiceGenerator.reinstate(req.body.reinstatedInvoiceMeta).then((updatedInvoiceGroup: InvoiceGroupDO) => {
            this.returnSuccesfulResponse(req, res, { invoiceGroup: updatedInvoiceGroup });
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.InvoiceGroupsControllerErrorsavingInvoiceGroup);
        });
    }

    public downloadInvoicePdf(req: Express.Request, res: any) {

        var pdfReportsService = req.appContext.getServiceFactory().getPdfReportsService();
        var invoiceDataAggregator = new InvoiceDataAggregator(req.appContext, req.sessionContext);
        var generatedPdfAbsolutePath: string;
        var query: InvoiceDataAggregatorQuery = {
            customerId: req.query['customerId'],
            invoiceGroupId: req.query['invoiceGroupId'],
            invoiceId: req.query['invoiceId'],
            payerIndex: req.query['payerIndex']
        };
        var thTranslation = new ThTranslation(req.sessionContext.language);

        invoiceDataAggregator.getInvoiceAggregatedData(query).then((invoiceAggregatedData: InvoiceAggregatedData) => {
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
}

var invoiceGroupsController = new InvoiceGroupsController();
module.exports = {
    getInvoiceGroupById: invoiceGroupsController.getInvoiceGroupById.bind(invoiceGroupsController),
    getInvoiceGroupList: invoiceGroupsController.getInvoiceGroupList.bind(invoiceGroupsController),
    getInvoiceGroupListCount: invoiceGroupsController.getInvoiceGroupListCount.bind(invoiceGroupsController),
    saveInvoiceGroupItem: invoiceGroupsController.saveInvoiceGroupItem.bind(invoiceGroupsController),
    generateCreditInvoice: invoiceGroupsController.generateCreditInvoice.bind(invoiceGroupsController),
    reinstateInvoice: invoiceGroupsController.reinstateInvoice.bind(invoiceGroupsController),
    downloadInvoicePdf: invoiceGroupsController.downloadInvoicePdf.bind(invoiceGroupsController),

}