import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThTranslation} from '../../../utils/localization/ThTranslation';
import {ReportType, PdfReportsServiceResponse} from '../../../services/pdf-reports/IPdfReportsService';
import {BaseEmailTemplateDO, EmailTemplateTypes} from '../../../services/email/data-objects/BaseEmailTemplateDO'
import {BookingConfirmationVMContainer} from './BookingConfirmationVMContainer';
import {BookingDataAggregatorQuery, BookingDataAggregator} from '../aggregators/BookingDataAggregator';
import {BookingAggregatedDataContainer} from '../aggregators/BookingAggregatedDataContainer';

import fs = require('fs');
import path = require('path');

export class BookingConfirmationEmailSender {
    private static BOOKING_CONFIRMATION_EMAIL_SUBJECT = 'Booking Confirmation';
    private _thTranslation: ThTranslation;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thTranslation = new ThTranslation(this._sessionContext.language);
    }

    public sendBookingConfirmation(bookingsQuery: BookingDataAggregatorQuery, emailDistributionList: string[]): Promise<boolean> {
        return new Promise<boolean>((resolve: { (emailSent: boolean): void }, reject: { (err: ThError): void }) => {
            this.sendBookingConfirmationCore(resolve, reject, bookingsQuery, emailDistributionList);
        });
    }

    private sendBookingConfirmationCore(resolve: { (emailSent: boolean): void }, reject: { (err: ThError): void }, bookingsQuery: BookingDataAggregatorQuery, emailDistributionList: string[]) {
        var pdfReportsService = this._appContext.getServiceFactory().getPdfReportsService();
        var bookingDataAggregator = new BookingDataAggregator(this._appContext, this._sessionContext);
        var generatedPdfAbsolutePath: string;

        bookingDataAggregator.getBookingAggregatedDataContainer(bookingsQuery).then((bookingAggregatedDataContainer: BookingAggregatedDataContainer) => {
            var bookingConfirmationVMContainer = new BookingConfirmationVMContainer(this._thTranslation);
            bookingConfirmationVMContainer.buildFromBookingAggregatedDataContainer(bookingAggregatedDataContainer);
            return pdfReportsService.generatePdfReport({
                reportType: ReportType.BookingConfirmation,
                reportData: bookingConfirmationVMContainer,
                settings: {

                }
            })
        }).then((result: PdfReportsServiceResponse) => {
            generatedPdfAbsolutePath = result.pdfPath;
            var emailService = this._appContext.getServiceFactory().getEmailService();
            var emailSubject = this._thTranslation.translate(BookingConfirmationEmailSender.BOOKING_CONFIRMATION_EMAIL_SUBJECT);
            var sendEmailPromiseList: Promise<boolean>[] = [];
            _.forEach(emailDistributionList, (emailAddress: string) => {
                sendEmailPromiseList.push(emailService.sendEmail({
                    to: emailDistributionList,
                    subject: emailSubject,
                    attachments: [generatedPdfAbsolutePath]
                }, new BaseEmailTemplateDO(EmailTemplateTypes.BookingConfirmation)));
            });
            return Promise.all(sendEmailPromiseList);
        }).then((result: any) => {
            var deletePdfPromise = this.removeFile(generatedPdfAbsolutePath);
            var deleteHtmlPromise = this.removeFile(this.getGeneratedHtmlPathFromPdfPath(generatedPdfAbsolutePath));
            return Promise.all([deletePdfPromise, deleteHtmlPromise]);
        }).then((result: any) => {
            resolve(true);
        }).catch((err: any) => {
            resolve(false);
        });
    }
    private getGeneratedHtmlPathFromPdfPath(generatedPdfAbsolutePath: string): string {
        var pathObject = path.parse(generatedPdfAbsolutePath);
        return pathObject.dir + path.sep + pathObject.name + '.html';
    }
    private removeFile(path: string): Promise<boolean> {
        return new Promise<boolean>((resolve: { (fileWasDeleted: boolean): void }, reject: { (err: ThError): void }) => {
            this.removeFileCore(resolve, reject, path);
        });
    }
    private removeFileCore(resolve: { (fileWasDeleted: boolean): void }, reject: { (err: ThError): void }, path: string) {
        fs.unlink(path, (err) => {
            resolve(true);
        });
    }
}