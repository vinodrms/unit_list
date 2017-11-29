import _ = require('underscore');
import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { BookingDOConstraints } from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import { BookingSearchResultRepoDO, BookingSearchCriteriaRepoDO } from '../../../../data-layer/bookings/repositories/IBookingRepository';
import { CustomerIdValidator } from '../../../customers/validators/CustomerIdValidator';
import { CustomersContainer } from '../../../customers/validators/results/CustomersContainer';
import { HotelOperationsQueryDO, HotelOperationsQueryType } from '../utils/HotelOperationsQueryDO';
import { HotelOperationsQueryDOParser } from '../utils/HotelOperationsQueryDOParser';
import { HotelOperationsDeparturesInfo } from './utils/HotelOperationsDeparturesInfo';
import { HotelOperationsDeparturesInfoBuilder } from './utils/HotelOperationsDeparturesInfoBuilder';
import { ThUtils } from '../../../../utils/ThUtils';
import { InvoiceDO, InvoicePaymentStatus } from "../../../../data-layer/invoices/data-objects/InvoiceDO";
import { InvoiceSearchResultRepoDO } from "../../../../data-layer/invoices/repositories/IInvoiceRepository";
import { BookingDO } from '../../../../data-layer/bookings/data-objects/BookingDO';

export class HotelOperationsDeparturesReader {
    private _thUtils: ThUtils;

    private _parsedQuery: HotelOperationsQueryDO;
    private _invoiceList: InvoiceDO[];

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public read(query: HotelOperationsQueryDO, queryType: HotelOperationsQueryType = HotelOperationsQueryType.RealTime): Promise<HotelOperationsDeparturesInfo> {
        return new Promise<HotelOperationsDeparturesInfo>((resolve: { (result: HotelOperationsDeparturesInfo): void }, reject: { (err: ThError): void }) => {
            this.readCore(resolve, reject, queryType, query);
        });
    }

    private readCore(resolve: { (result: HotelOperationsDeparturesInfo): void }, reject: { (err: ThError): void }, queryType: HotelOperationsQueryType, query: HotelOperationsQueryDO) {
        var departuresInfoBuilder = new HotelOperationsDeparturesInfoBuilder(this._appContext, this._sessionContext);
        var totalDeparturesForReferenceDate: number;
        var queryParser = new HotelOperationsQueryDOParser(this._appContext, this._sessionContext);
        return queryParser.parse(query).then((parsedQuery: HotelOperationsQueryDO) => {
            this._parsedQuery = parsedQuery;

            var bookingRepository = this._appContext.getRepositoryFactory().getBookingRepository();
            return bookingRepository.getBookingList(
                { hotelId: this._sessionContext.sessionDO.hotel.id },
                this.getDeparturesQuery()
            );
        }).then((bookingSearchResult: BookingSearchResultRepoDO) => {
            totalDeparturesForReferenceDate = bookingSearchResult.bookingList.length;
            var bookingList = this.getDepartureBookings(bookingSearchResult.bookingList, queryType);
            departuresInfoBuilder.appendBookingList(bookingList);

            var invoiceRepo = this._appContext.getRepositoryFactory().getInvoiceRepository();
            return invoiceRepo.getInvoiceList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                invoicePaymentStatus: InvoicePaymentStatus.Unpaid
            });
        }).then((invoiceSearchResult: InvoiceSearchResultRepoDO) => {
            this._invoiceList = invoiceSearchResult.invoiceList;

            var linkedBookingIdList = this.getBookingIdListLinkedToUnpaidInvoices();
            var bookingRepository = this._appContext.getRepositoryFactory().getBookingRepository();
            return bookingRepository.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                bookingIdList: linkedBookingIdList
            });
        }).then((bookingSearchResult: BookingSearchResultRepoDO) => {
            departuresInfoBuilder.appendInvoiceInformation(this._invoiceList, bookingSearchResult.bookingList);

            var customerIdList: string[] = departuresInfoBuilder.getCustomerIdList();
            var customerValidator = new CustomerIdValidator(this._appContext, this._sessionContext);
            return customerValidator.validateCustomerIdList(customerIdList);
        }).then((customersContainer: CustomersContainer) => {
            departuresInfoBuilder.appendCustomerInformation(customersContainer);

            var departuresInfo = departuresInfoBuilder.getBuiltHotelOperationsDeparturesInfo();
            departuresInfo.referenceDate = this._parsedQuery.referenceDate;
            departuresInfo.totalDeparturesForReferenceDate = totalDeparturesForReferenceDate;
            resolve(departuresInfo);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.HotelOperationsDeparturesReaderError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error getting hotel departures information", this._sessionContext, thError);
            }
            reject(thError);
        });
    }

    private getBookingIdListLinkedToUnpaidInvoices(): string[] {
        var bookingIdList: string[] = [];
        _.forEach(this._invoiceList, (invoice: InvoiceDO) => {
            if (_.isArray(invoice.indexedBookingIdList)) {
                bookingIdList = bookingIdList.concat(invoice.indexedBookingIdList);
            }
        });
        return _.uniq(bookingIdList);
    }

    private getDeparturesQuery(): BookingSearchCriteriaRepoDO {
        return {
            endDateEq: this._parsedQuery.referenceDate,
            checkOutDateNullOrGreaterOrEqualThan: this._parsedQuery.referenceDate
        }
    }

    private getDepartureBookings(bookings: BookingDO[], queryType: HotelOperationsQueryType) {
        switch (queryType) {
            case HotelOperationsQueryType.FixedForTheDay:
                return _.filter(bookings, (booking: BookingDO) => {return BookingDOConstraints.ConfirmationStatuses_FixedDepartures.indexOf(booking.confirmationStatus) >= 0;});
            default:
                return _.filter(bookings, (booking: BookingDO) => {return BookingDOConstraints.ConfirmationStatuses_ShowInDepartures.indexOf(booking.confirmationStatus) >= 0;});        
        }
    }
}
