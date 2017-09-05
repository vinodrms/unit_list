import { ThError } from '../core/utils/th-responses/ThError';
import { BaseController } from './base/BaseController';
import { ThStatusCode } from '../core/utils/th-responses/ThResponse';
import { AppContext } from '../core/utils/AppContext';
import { SessionContext, SessionDO } from '../core/utils/SessionContext';
import { ThTranslation } from '../core/utils/localization/ThTranslation';
import { InvoiceGroupMetaRepoDO, InvoiceGroupSearchCriteriaRepoDO, InvoiceGroupSearchResultRepoDO } from '../core/data-layer/invoices-deprecated/repositories/IInvoiceGroupsRepository';
import { InvoiceGroupDO } from '../core/data-layer/invoices-deprecated/data-objects/InvoiceGroupDO';
import { InvoiceDO } from '../core/data-layer/invoices-deprecated/data-objects/InvoiceDO';
import { LazyLoadRepoDO, LazyLoadMetaResponseRepoDO } from '../core/data-layer/common/repo-data-objects/LazyLoadRepoDO';
import { SaveInvoiceGroup } from '../core/domain-layer/invoices-deprecated/save-invoice-group/SaveInvoiceGroup';
import { InvoiceDataAggregator, InvoiceDataAggregatorQuery } from '../core/domain-layer/invoices-deprecated/aggregators/InvoiceDataAggregator';
import { InvoiceAggregatedData } from '../core/domain-layer/invoices-deprecated/aggregators/InvoiceAggregatedData';
import { InvoiceConfirmationVMContainer } from '../core/domain-layer/invoices-deprecated/invoice-confirmations/InvoiceConfirmationVMContainer';
import { ReportType, PdfReportsServiceResponse } from '../core/services/pdf-reports/IPdfReportsService';
import { ReinstateInvoice } from "../core/domain-layer/invoices-deprecated/reinstate-invoice/ReinstateInvoice";
import { TokenService } from "../core/domain-layer/token/TokenService";
import { ITokenService } from "../core/domain-layer/token/ITokenService";
import { IUser } from "../core/bootstrap/oauth/OAuthServerInitializer";

/**
 * @deprecated
 */
export class InvoiceGroupsDeprecatedController extends BaseController {

    public getInvoiceGroupById(req: any, res: any) {
        if (!this.precheckGETParameters(req, res, ['id'])) { return };

        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;
        var invoiceGroupId = req.query.id;
        var invoiceGroupMeta = this.getInvoiceGroupMetaRepoDOFrom(sessionContext);
        var invoiceGroupRepo = appContext.getRepositoryFactory().getInvoiceGroupsRepositoryDeprecated();

        invoiceGroupRepo.getInvoiceGroupById(this.getInvoiceGroupMetaRepoDOFrom(sessionContext), invoiceGroupId).then((invoiceGroup: InvoiceGroupDO) => {
            this.returnSuccesfulResponse(req, res, invoiceGroup);
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.InvoiceControllerErrorGettingInvoiceById);
        });
    }

    public getInvoiceGroupList(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;
        var invoiceGroupMeta = this.getInvoiceGroupMetaRepoDOFrom(sessionContext);
        var invoiceGroupRepo = appContext.getRepositoryFactory().getInvoiceGroupsRepositoryDeprecated();

        invoiceGroupRepo.getInvoiceGroupList(invoiceGroupMeta, req.body.searchCriteria, req.body.lazyLoad).then((result: InvoiceGroupSearchResultRepoDO) => {
            this.returnSuccesfulResponse(req, res, result);
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.InvoiceControllerErrorGettingInvoices);
        });
    }

    public getInvoiceGroupListCount(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;
        var invoiceGroupMeta = this.getInvoiceGroupMetaRepoDOFrom(sessionContext);
        var invoiceGroupRepo = appContext.getRepositoryFactory().getInvoiceGroupsRepositoryDeprecated();

        invoiceGroupRepo.getInvoiceGroupListCount(invoiceGroupMeta, req.body.searchCriteria).then((lazyLoadMeta: LazyLoadMetaResponseRepoDO) => {
            this.returnSuccesfulResponse(req, res, lazyLoadMeta);
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.InvoiceControllerErrorGettingInvoicesCount);
        });
    }

    private getInvoiceGroupMetaRepoDOFrom(sessionContext: SessionContext): InvoiceGroupMetaRepoDO {
        return { hotelId: sessionContext.sessionDO.hotel.id };
    }

    public saveInvoiceGroupItem(req: any, res: any) {
        var saveInvoiceGroup = new SaveInvoiceGroup(req.appContext, req.sessionContext);

        saveInvoiceGroup.save(req.body.invoiceGroup).then((updatedInvoiceGroup: InvoiceGroupDO) => {
            this.returnSuccesfulResponse(req, res, { invoiceGroup: updatedInvoiceGroup });
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.InvoicesControllerErrorSavingInvoice);
        });
    }

    public reinstateInvoice(req: any, res: any) {
        let reinstatementInvoiceGenerator = new ReinstateInvoice(req.appContext, req.sessionContext);

        reinstatementInvoiceGenerator.reinstate(req.body.reinstatedInvoiceMeta).then((updatedInvoiceGroup: InvoiceGroupDO) => {
            this.returnSuccesfulResponse(req, res, { invoiceGroup: updatedInvoiceGroup });
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
                invoiceGroupId: req.query['invoiceGroupId'],
                invoiceId: req.query['invoiceId'],
                payerIndex: req.query['payerIndex']
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
}

var invoiceGroupsController = new InvoiceGroupsDeprecatedController();
module.exports = {
    getInvoiceGroupById: invoiceGroupsController.getInvoiceGroupById.bind(invoiceGroupsController),
    getInvoiceGroupList: invoiceGroupsController.getInvoiceGroupList.bind(invoiceGroupsController),
    getInvoiceGroupListCount: invoiceGroupsController.getInvoiceGroupListCount.bind(invoiceGroupsController),
    saveInvoiceGroupItem: invoiceGroupsController.saveInvoiceGroupItem.bind(invoiceGroupsController),
    reinstateInvoice: invoiceGroupsController.reinstateInvoice.bind(invoiceGroupsController),
    downloadInvoicePdf: invoiceGroupsController.downloadInvoicePdf.bind(invoiceGroupsController),

}
