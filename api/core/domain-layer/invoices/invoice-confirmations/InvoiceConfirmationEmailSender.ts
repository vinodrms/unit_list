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
import { HotelDO } from "../../../data-layer/hotel/data-objects/HotelDO";
import { InvoiceEmailTemplateDO } from "../../../services/email/data-objects/InvoiceEmailTemplateDO";
import { ThUtils } from "../../../utils/ThUtils";

import fs = require('fs');
import path = require('path');
import _ = require("underscore");
import { InvoicePayerDO } from '../../../data-layer/invoices/data-objects/payer/InvoicePayerDO';
import { InvoicePaymentMethodType } from '../../../data-layer/invoices/data-objects/payer/InvoicePaymentMethodDO';


export class InvoiceConfirmationEmailSender {
    private static INVOICE_EMAIL_SUBJECT = 'Invoice';
    private _thTranslation: ThTranslation;
    private _thUtils: ThUtils;
    private _invoiceAggregatedData: InvoiceAggregatedData;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thTranslation = new ThTranslation(this._sessionContext.language);
        this._thUtils = new ThUtils();
    }

    public sendInvoiceConfirmation(query: InvoiceDataAggregatorQuery, emailDistributionList: string[]): Promise<boolean> {
        return new Promise<boolean>((resolve: { (emailSent: boolean): void }, reject: { (err: ThError): void }) => {
            this.sendInvoiceConfirmationCore(resolve, reject, query, emailDistributionList);
        });
    }

    private sendInvoiceConfirmationCore(resolve: { (emailSent: boolean): void }, reject: { (err: ThError): void }, query: InvoiceDataAggregatorQuery, emailDistributionList: string[]) {
        var generatedPdfAbsolutePath: string;
        var hotel: HotelDO;

        this._appContext.getRepositoryFactory().getHotelRepository().getHotelById(this._sessionContext.sessionDO.hotel.id).then((loadedHotel: HotelDO) => {
            hotel = loadedHotel;
            var invoiceDataAggregator = new InvoiceDataAggregator(this._appContext, this._sessionContext);

            return invoiceDataAggregator.getInvoiceAggregatedData(query);
        }).then((invoiceAggregatedData: InvoiceAggregatedData) => {
            this._invoiceAggregatedData = invoiceAggregatedData;
            var invoiceConfirmationVMContainer = new InvoiceConfirmationVMContainer(this._thTranslation);
            invoiceConfirmationVMContainer.buildFromInvoiceAggregatedDataContainer(invoiceAggregatedData);
            var pdfReportsService = this._appContext.getServiceFactory().getPdfReportsService();

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
                    attachments: [generatedPdfAbsolutePath],
                    fromName: hotel.contactDetails.name
                }, this.getInvoiceEmailTemplateDO(hotel)));
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

    private getInvoiceEmailTemplateDO(hotelDO: HotelDO): InvoiceEmailTemplateDO {
        var emailTemplateDO = new InvoiceEmailTemplateDO();
        emailTemplateDO.hotelCountry = !this._thUtils.isUndefinedOrNull(hotelDO, "contactDetails.address.country.name") ? hotelDO.contactDetails.address.country.name : "";
        emailTemplateDO.hotelEmail = !this._thUtils.isUndefinedOrNull(hotelDO, "contactDetails.email") ? hotelDO.contactDetails.email : "";
        emailTemplateDO.hotelPhone = !this._thUtils.isUndefinedOrNull(hotelDO, "contactDetails.phone") ? hotelDO.contactDetails.phone : "";
        emailTemplateDO.hotelName = !this._thUtils.isUndefinedOrNull(hotelDO, "contactDetails.phone") ? hotelDO.contactDetails.name : "";
        emailTemplateDO.hotelAddressLine1 = !this._thUtils.isUndefinedOrNull(hotelDO, "contactDetails.address.streetAddress") ? hotelDO.contactDetails.address.streetAddress : "";
        emailTemplateDO.hotelAddressLine2 = !this._thUtils.isUndefinedOrNull(hotelDO, "contactDetails.address.postalCode") ? hotelDO.contactDetails.address.postalCode : "";
        emailTemplateDO.hotelAddressLine2 += !this._thUtils.isUndefinedOrNull(hotelDO, "contactDetails.address.city") ? (" " + hotelDO.contactDetails.address.city) : "";
        emailTemplateDO.paymentDueInDays = hotelDO.paymentDueInDays;
        emailTemplateDO.paymentDueDateString = (this._invoiceAggregatedData.invoice) ? this._invoiceAggregatedData.invoice.paymentDueDate.toString() : "";
        emailTemplateDO.shouldSendInvoiceDueDate = this._invoiceAggregatedData.invoice && this.isCorporatePayerWithPayByAgreement();
        return emailTemplateDO;
    }

    private isCorporatePayerWithPayByAgreement() {
        return this._invoiceAggregatedData.payerCustomer.isCompanyOrTravelAgency()
            && _.find(this._invoiceAggregatedData.invoice.payerList, (payer: InvoicePayerDO) => { return this._invoiceAggregatedData.payerCustomer.id === payer.customerId }).paymentMethod.type === InvoicePaymentMethodType.PayInvoiceByAgreement;
    }

}
