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
import { HotelOperationsArrivalsInfo } from './utils/HotelOperationsArrivalsInfo';
import { HotelOperationsArrivalsInfoBuilder } from './utils/HotelOperationsArrivalsInfoBuilder';
import { HotelDO } from '../../../../data-layer/hotel/data-objects/HotelDO';

export class HotelOperationsArrivalsReader {
    private _parsedQuery: HotelOperationsQueryDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public read(query: HotelOperationsQueryDO, queryType: HotelOperationsQueryType = HotelOperationsQueryType.RealTime): Promise<HotelOperationsArrivalsInfo> {
        return new Promise<HotelOperationsArrivalsInfo>((resolve: { (result: HotelOperationsArrivalsInfo): void }, reject: { (err: ThError): void }) => {
            this.readCore(resolve, reject, queryType, query);
        });
    }

    private readCore(resolve: { (result: HotelOperationsArrivalsInfo): void }, reject: { (err: ThError): void }, queryType: HotelOperationsQueryType, query: HotelOperationsQueryDO) {
        var arrivalsInfoBuilder = new HotelOperationsArrivalsInfoBuilder();

        var queryParser = new HotelOperationsQueryDOParser(this._appContext, this._sessionContext);
        return queryParser.parse(query).then((parsedQuery: HotelOperationsQueryDO) => {
            this._parsedQuery = parsedQuery;

            var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
            return hotelRepository.getHotelById(this._sessionContext.sessionDO.hotel.id);
        }).then((loadedHotel: HotelDO) => {
            arrivalsInfoBuilder.hotel = loadedHotel;

            var bookingRepository = this._appContext.getRepositoryFactory().getBookingRepository();
            return bookingRepository.getBookingList(
                { hotelId: this._sessionContext.sessionDO.hotel.id },
                this.getArrivalsQuery(queryType)
            );
        }).then((canBeCheckedInSearchResult: BookingSearchResultRepoDO) => {
            var canBeCheckedInBookingList = canBeCheckedInSearchResult.bookingList;
            arrivalsInfoBuilder.appendCanBeCheckedInBookingList(canBeCheckedInBookingList);

            var bookingRepository = this._appContext.getRepositoryFactory().getBookingRepository();
            return bookingRepository.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_NoShow,
                startDateLte: this._parsedQuery.referenceDate
            });
        }).then((noShowSearchResult: BookingSearchResultRepoDO) => {
            var noShowBookingList = noShowSearchResult.bookingList;
            arrivalsInfoBuilder.appendNoShowBookingList(noShowBookingList);

            var customerIdList: string[] = arrivalsInfoBuilder.getCustomerIdList();
            var customerValidator = new CustomerIdValidator(this._appContext, this._sessionContext);
            return customerValidator.validateCustomerIdList(customerIdList);
        }).then((customersContainer: CustomersContainer) => {
            arrivalsInfoBuilder.appendCustomerInformation(customersContainer);

            var arrivalsInfo = arrivalsInfoBuilder.getBuiltHotelOperationsArrivalsInfo();
            arrivalsInfo.referenceDate = this._parsedQuery.referenceDate;
            resolve(arrivalsInfo);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.HotelOperationsArrivalsReaderError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error getting hotel arrivals information", this._sessionContext, thError);
            }
            reject(thError);
        });
    }

    private getArrivalsQuery(queryType: HotelOperationsQueryType): BookingSearchCriteriaRepoDO {
        switch (queryType) {
            case HotelOperationsQueryType.FixedForTheDay:
                return {
                    confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_FixedArrivals,
                    startDateEq: this._parsedQuery.referenceDate
                }
            default:
                return {
                    confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_CanBeCheckedIn,
                    startDateEq: this._parsedQuery.referenceDate
                }
        }
    }
}