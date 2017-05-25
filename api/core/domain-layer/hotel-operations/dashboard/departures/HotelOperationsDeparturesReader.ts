import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {BookingDOConstraints} from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import { BookingSearchResultRepoDO, BookingSearchCriteriaRepoDO } from '../../../../data-layer/bookings/repositories/IBookingRepository';
import {InvoicePaymentStatus} from '../../../../data-layer/invoices/data-objects/InvoiceDO';
import {InvoiceGroupSearchResultRepoDO} from '../../../../data-layer/invoices/repositories/IInvoiceGroupsRepository';
import {InvoiceGroupDO} from '../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import {InvoiceDO} from '../../../../data-layer/invoices/data-objects/InvoiceDO';
import {CustomerIdValidator} from '../../../customers/validators/CustomerIdValidator';
import {CustomersContainer} from '../../../customers/validators/results/CustomersContainer';
import { HotelOperationsQueryDO, HotelOperationsQueryType } from '../utils/HotelOperationsQueryDO';
import {HotelOperationsQueryDOParser} from '../utils/HotelOperationsQueryDOParser';
import {HotelOperationsDeparturesInfo} from './utils/HotelOperationsDeparturesInfo';
import {HotelOperationsDeparturesInfoBuilder} from './utils/HotelOperationsDeparturesInfoBuilder';
import {ThUtils} from '../../../../utils/ThUtils';

import _ = require('underscore');

export class HotelOperationsDeparturesReader {
    private _thUtils: ThUtils;

    private _parsedQuery: HotelOperationsQueryDO;
    private _invoiceGroupList: InvoiceGroupDO[];

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public read(query: HotelOperationsQueryDO, queryType: HotelOperationsQueryType = HotelOperationsQueryType.RealTime): Promise<HotelOperationsDeparturesInfo> {
        return new Promise<HotelOperationsDeparturesInfo>((resolve: { (result: HotelOperationsDeparturesInfo): void }, reject: { (err: ThError): void }) => {
            this.readCore(resolve, reject, queryType, query);
        });
    }

    private readCore(resolve: { (result: HotelOperationsDeparturesInfo): void }, reject: { (err: ThError): void }, queryType: HotelOperationsQueryType, query: HotelOperationsQueryDO) {
        var departuresInfoBuilder = new HotelOperationsDeparturesInfoBuilder();
        
        var queryParser = new HotelOperationsQueryDOParser(this._appContext, this._sessionContext);
        return queryParser.parse(query).then((parsedQuery: HotelOperationsQueryDO) => {
            this._parsedQuery = parsedQuery;

            var bookingRepository = this._appContext.getRepositoryFactory().getBookingRepository();
            return bookingRepository.getBookingList(
                { hotelId: this._sessionContext.sessionDO.hotel.id }, 
                this.getDeparturesQuery(queryType)
            );
        }).then((bookingSearchResult: BookingSearchResultRepoDO) => {
            var bookingList = bookingSearchResult.bookingList;
            departuresInfoBuilder.appendBookingList(bookingList);

            var invoiceRepo = this._appContext.getRepositoryFactory().getInvoiceGroupsRepository();
            return invoiceRepo.getInvoiceGroupList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                invoicePaymentStatus: InvoicePaymentStatus.Unpaid
            });
        }).then((invoiceSearchResult: InvoiceGroupSearchResultRepoDO) => {
            this._invoiceGroupList = invoiceSearchResult.invoiceGroupList;

            var linkedBookingIdList = this.getBookingIdListLinkedToUnpaidInvoices();
            var bookingRepository = this._appContext.getRepositoryFactory().getBookingRepository();
            return bookingRepository.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                bookingIdList: linkedBookingIdList
            });
        }).then((bookingSearchResult: BookingSearchResultRepoDO) => {
            departuresInfoBuilder.appendInvoiceInformation(this._invoiceGroupList, bookingSearchResult.bookingList);

            var customerIdList: string[] = departuresInfoBuilder.getCustomerIdList();
            var customerValidator = new CustomerIdValidator(this._appContext, this._sessionContext);
            return customerValidator.validateCustomerIdList(customerIdList);
        }).then((customersContainer: CustomersContainer) => {
            departuresInfoBuilder.appendCustomerInformation(customersContainer);

            var departuresInfo = departuresInfoBuilder.getBuiltHotelOperationsDeparturesInfo();
            departuresInfo.referenceDate = this._parsedQuery.referenceDate;
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
        _.forEach(this._invoiceGroupList, (invoiceGroup: InvoiceGroupDO) => {
            _.forEach(invoiceGroup.invoiceList, (invoice: InvoiceDO) => {
                if (!invoice.isClosed() && !this._thUtils.isUndefinedOrNull(invoice.bookingId)) {
                    bookingIdList.push(invoice.bookingId);
                }
            });
        });
        return _.uniq(bookingIdList);
    }

    private getDeparturesQuery(queryType: HotelOperationsQueryType): BookingSearchCriteriaRepoDO {
        switch(queryType) {
            case HotelOperationsQueryType.FixedForTheDay :
                return {
                    confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_FixedDepartures,
                    endDate: this._parsedQuery.referenceDate,
                    checkOutDateGreaterOrEqualThan: this._parsedQuery.referenceDate
                }
            default:
                return {
                    confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_ShowInDepartures,
                    endDate: this._parsedQuery.referenceDate
                }
        }
    }
}