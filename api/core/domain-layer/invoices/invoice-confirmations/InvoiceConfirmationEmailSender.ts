import { ThLogger, ThLogLevel } from '../../../utils/logging/ThLogger';
import { ThError } from '../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { ThTranslation } from '../../../utils/localization/ThTranslation';
import { InvoiceAggregatedData } from '../aggregators/InvoiceAggregatedData';
import { InvoiceDataAggregator, InvoiceDataAggregatorQuery } from '../aggregators/InvoiceDataAggregator';
import { InvoiceConfirmationVMContainer } from './InvoiceConfirmationVMContainer';
import { ReportType, PdfReportsServiceResponse } from '../../../services/pdf-reports/IPdfReportsService';
import { BaseEmailTemplateDO, EmailTemplateTypes } from '../../../services/email/data-objects/BaseEmailTemplateDO'

import fs = require('fs');
import path = require('path');

export class InvoiceConfirmationEmailSender {
    private static INVOICE_EMAIL_SUBJECT = 'Invoice';
    private _thTranslation: ThTranslation;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thTranslation = new ThTranslation(this._sessionContext.language);
    }

    public sendInvoiceConfirmation(query: InvoiceDataAggregatorQuery, emailDistributionList: string[]): Promise<boolean> {
        return new Promise<boolean>((resolve: { (emailSent: boolean): void }, reject: { (err: ThError): void }) => {
            this.sendInvoiceConfirmationCore(resolve, reject, query, emailDistributionList);
        });
    }

    private sendInvoiceConfirmationCore(resolve: { (emailSent: boolean): void }, reject: { (err: ThError): void }, query: InvoiceDataAggregatorQuery, emailDistributionList: string[]) {
        var pdfReportsService = this._appContext.getServiceFactory().getPdfReportsService();
        var invoiceDataAggregator = new InvoiceDataAggregator(this._appContext, this._sessionContext);
        var generatedPdfAbsolutePath: string;

        invoiceDataAggregator.getInvoiceAggregatedData(query).then((invoiceAggregatedData: InvoiceAggregatedData) => {
            var invoiceConfirmationVMContainer = new InvoiceConfirmationVMContainer(this._thTranslation);
            invoiceConfirmationVMContainer.buildFromInvoiceAggregatedDataContainer(invoiceAggregatedData);

            return pdfReportsService.generatePdfReport({
                reportType: ReportType.Invoice,
                reportData: invoiceConfirmationVMContainer,
                settings: {

                }
            })
        }).then((result: PdfReportsServiceResponse) => {
            generatedPdfAbsolutePath = result.pdfPath;
            var emailService = this._appContext.getServiceFactory().getEmailService();
            var emailSubject = this._thTranslation.translate(InvoiceConfirmationEmailSender.INVOICE_EMAIL_SUBJECT);
            var sendEmailPromiseList: Promise<boolean>[] = [];
            _.forEach(emailDistributionList, (emailAddress: string) => {
                sendEmailPromiseList.push(emailService.sendEmail({
                    to: [emailAddress],
                    subject: emailSubject,
                    attachments: [generatedPdfAbsolutePath]
                }, new BaseEmailTemplateDO(EmailTemplateTypes.Invoice)));
            });
            return Promise.all(sendEmailPromiseList);
        }).then((result: any) => {
            let fileService = this._appContext.getServiceFactory().getFileService();
            fileService.deleteFile(generatedPdfAbsolutePath);
            resolve(true);
        }).catch((err: any) => {
            var thError = new ThError(ThStatusCode.InvoiceEmailSenderErrorSendingEmail, err);
            ThLogger.getInstance().logError(ThLogLevel.Error, "error sending invoice by email", { invoicesQuery: query, distributionList: emailDistributionList }, thError);
            resolve(false);
        });
    }
}