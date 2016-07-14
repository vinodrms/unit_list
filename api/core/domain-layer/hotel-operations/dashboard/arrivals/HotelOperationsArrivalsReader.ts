import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {BookingDOConstraints} from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import {BookingSearchResultRepoDO} from '../../../../data-layer/bookings/repositories/IBookingRepository';
import {CustomerIdValidator} from '../../../customers/validators/CustomerIdValidator';
import {CustomersContainer} from '../../../customers/validators/results/CustomersContainer';
import {HotelOperationsQueryDO} from '../utils/HotelOperationsQueryDO';
import {HotelOperationsQueryDOParser} from '../utils/HotelOperationsQueryDOParser';
import {HotelOperationsArrivalsInfo} from './utils/HotelOperationsArrivalsInfo';
import {HotelOperationsArrivalsInfoBuilder} from './utils/HotelOperationsArrivalsInfoBuilder';

export class HotelOperationsArrivalsReader {
    private _parsedQuery: HotelOperationsQueryDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public read(query: HotelOperationsQueryDO): Promise<HotelOperationsArrivalsInfo> {
        return new Promise<HotelOperationsArrivalsInfo>((resolve: { (result: HotelOperationsArrivalsInfo): void }, reject: { (err: ThError): void }) => {
            this.readCore(resolve, reject, query);
        });
    }

    private readCore(resolve: { (result: HotelOperationsArrivalsInfo): void }, reject: { (err: ThError): void }, query: HotelOperationsQueryDO) {
        var arrivalsInfoBuilder = new HotelOperationsArrivalsInfoBuilder();

        var queryParser = new HotelOperationsQueryDOParser(this._appContext, this._sessionContext);
        return queryParser.parse(query).then((parsedQuery: HotelOperationsQueryDO) => {
            this._parsedQuery = parsedQuery;

            var bookingRepository = this._appContext.getRepositoryFactory().getBookingRepository();
            return bookingRepository.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_CanBeCheckedIn,
                startDate: this._parsedQuery.referenceDate
            });
        }).then((canBeCheckedInSearchResult: BookingSearchResultRepoDO) => {
            var canBeCheckedInBookingList = canBeCheckedInSearchResult.bookingList;
            arrivalsInfoBuilder.appendCanBeCheckedInBookingList(canBeCheckedInBookingList);

            var bookingRepository = this._appContext.getRepositoryFactory().getBookingRepository();
            return bookingRepository.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_NoShow,
                beforeStartDate: this._parsedQuery.referenceDate
            });
        }).then((noShowSearchResult: BookingSearchResultRepoDO) => {
            var noShowBookingList = noShowSearchResult.bookingList;
            arrivalsInfoBuilder.appendNoShowBookingList(noShowBookingList);

            var customerIdList: string[] = arrivalsInfoBuilder.getCustomerIdList();
            var customerValidator = new CustomerIdValidator(this._appContext, this._sessionContext);
            return customerValidator.validateCustomerIdList(customerIdList);
        }).then((customersContainer: CustomersContainer) => {
            arrivalsInfoBuilder.appendCustomerInformation(customersContainer);

            resolve(arrivalsInfoBuilder.getBuiltHotelOperationsArrivalsInfo());
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.HotelOperationsArrivalsReaderError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error getting hotel arrivals information", this._sessionContext, thError);
            }
            reject(thError);
        });
    }
}