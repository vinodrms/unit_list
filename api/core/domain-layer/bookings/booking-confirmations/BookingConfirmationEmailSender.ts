import { ThLogger, ThLogLevel } from '../../../utils/logging/ThLogger';
import { ThError } from '../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { ThTranslation } from '../../../utils/localization/ThTranslation';
import { ReportType, PdfReportsServiceResponse } from '../../../services/pdf-reports/IPdfReportsService';
import { BaseEmailTemplateDO, EmailTemplateTypes } from '../../../services/email/data-objects/BaseEmailTemplateDO'
import { BookingConfirmationVMContainer } from './BookingConfirmationVMContainer';
import { BookingDataAggregatorQuery, BookingDataAggregator } from '../aggregators/BookingDataAggregator';
import { BookingAggregatedDataContainer } from '../aggregators/BookingAggregatedDataContainer';

import fs = require('fs');
import path = require('path');
import { BookingAggregatedData } from "../aggregators/BookingAggregatedData";
import { CustomerDO } from "../../../data-layer/customers/data-objects/CustomerDO";
import { HotelDO } from "../../../data-layer/hotel/data-objects/HotelDO";
import { BookingConfirmationEmailTemplateDO } from "../../../services/email/data-objects/BookingConfirmationEmailTemplateDO";
import { ThUtils } from "../../../utils/ThUtils";
import { EmailDistributionDO } from "../../hotel-operations/common/email-confirmations/utils/data-objects/EmailDistributionDO";

export class BookingConfirmationEmailSender {
    private static BOOKING_CONFIRMATION_EMAIL_SUBJECT = 'Booking Confirmation';
    private _thTranslation: ThTranslation;
    private _hotelDO: HotelDO;
    private _thUtils: ThUtils;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thTranslation = new ThTranslation(this._sessionContext.language);
        this._thUtils = new ThUtils();
    }

    public sendBookingConfirmation(bookingsQuery: BookingDataAggregatorQuery, emailDistributionList: EmailDistributionDO[]): Promise<boolean> {
        return new Promise<boolean>((resolve: { (emailSent: boolean): void }, reject: { (err: ThError): void }) => {
            this.sendBookingConfirmationCore(resolve, reject, bookingsQuery, emailDistributionList);
        });
    }

    private sendBookingConfirmationCore(resolve: { (emailSent: boolean): void }, reject: { (err: ThError): void }, bookingsQuery: BookingDataAggregatorQuery, emailDistributionList: EmailDistributionDO[]) {
        var pdfReportsService = this._appContext.getServiceFactory().getPdfReportsService();
        var bookingDataAggregator = new BookingDataAggregator(this._appContext, this._sessionContext);
        var generatedPdfAbsolutePath: string;

        bookingDataAggregator.getBookingAggregatedDataContainer(bookingsQuery).then((bookingAggregatedDataContainer: BookingAggregatedDataContainer) => {
            var bookingConfirmationVMContainer = new BookingConfirmationVMContainer(this._thTranslation);
            bookingConfirmationVMContainer.buildFromBookingAggregatedDataContainer(bookingAggregatedDataContainer);
            this._hotelDO = bookingAggregatedDataContainer.hotel;
            if(this.bookingConfirmationBlocked(bookingAggregatedDataContainer)) {
                throw new Error(this._thTranslation.translate('Booking confirmations are blocked for this booking.'));
            }
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
            _.forEach(emailDistributionList, (emailDistribution: EmailDistributionDO) => {
                sendEmailPromiseList.push(emailService.sendEmail({
                    to: [emailDistribution.email],
                    subject: emailSubject,
                    attachments: [generatedPdfAbsolutePath]
                }, this.getBookingConfirmationEmailTemplateDO(this._hotelDO, emailDistribution)));
            });
            return Promise.all(sendEmailPromiseList);
        }).then((result: any) => {
            let fileService = this._appContext.getServiceFactory().getFileService();
            fileService.deleteFile(generatedPdfAbsolutePath);
            resolve(true);
        }).catch((err: any) => {
            var thError = new ThError(ThStatusCode.BookingConfirmationEmailSenderErrorSendingEmail, err);
            ThLogger.getInstance().logError(ThLogLevel.Error, "error sending booking confirmation by email", { bookingQuery: bookingsQuery, distributionList: emailDistributionList }, thError);
            reject(err);
        });
    }

    private getBookingConfirmationEmailTemplateDO(hotelDO: HotelDO, emailDistribution: EmailDistributionDO): BookingConfirmationEmailTemplateDO {
        var emailTemplateDO = new BookingConfirmationEmailTemplateDO();
        emailTemplateDO.hotelCountry = !this._thUtils.isUndefinedOrNull(hotelDO, "contactDetails.address.country.name") ? hotelDO.contactDetails.address.country.name : "";
        emailTemplateDO.hotelEmail = !this._thUtils.isUndefinedOrNull(hotelDO, "contactDetails.email") ? hotelDO.contactDetails.email : "";
        emailTemplateDO.hotelPhone = !this._thUtils.isUndefinedOrNull(hotelDO, "contactDetails.phone") ? hotelDO.contactDetails.phone : "";
        emailTemplateDO.hotelName =  !this._thUtils.isUndefinedOrNull(hotelDO, "contactDetails.phone") ? hotelDO.contactDetails.name : "";
        emailTemplateDO.hotelAddressLine1 = !this._thUtils.isUndefinedOrNull(hotelDO, "contactDetails.address.streetAddress") ? hotelDO.contactDetails.address.streetAddress: "";
        emailTemplateDO.hotelAddressLine2 = !this._thUtils.isUndefinedOrNull(hotelDO, "contactDetails.address.postalCode") ? hotelDO.contactDetails.address.postalCode : "";
        emailTemplateDO.hotelAddressLine2 += !this._thUtils.isUndefinedOrNull(hotelDO, "contactDetails.address.city") ? (" " + hotelDO.contactDetails.address.city) : "";
        emailTemplateDO.guestName = !this._thUtils.isUndefinedOrNull(emailDistribution.guestName) ? emailDistribution.guestName : "";
        return emailTemplateDO;
    }

    private bookingConfirmationBlocked(bookingAggregatedDataContainer: BookingAggregatedDataContainer): boolean {
        var allCustomers = _.chain(bookingAggregatedDataContainer.bookingAggregatedDataList).map((bookingAggregatedData: BookingAggregatedData) => {
            return bookingAggregatedData.customerList;
        }).flatten().value();
        
        var customersAbleToReceiveConfirmations = _.filter(allCustomers, (customer: CustomerDO) => {
            return customer.customerDetails.canReceiveBookingConfirmations();
        });
        if(!_.isEmpty(allCustomers) && allCustomers.length > customersAbleToReceiveConfirmations.length) {
            return true;
        }
        return false;
    }

}