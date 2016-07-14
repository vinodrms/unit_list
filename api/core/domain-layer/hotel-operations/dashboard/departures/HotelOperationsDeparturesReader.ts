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
import {HotelOperationsDeparturesInfo} from './utils/HotelOperationsDeparturesInfo';
import {HotelOperationsDeparturesInfoBuilder} from './utils/HotelOperationsDeparturesInfoBuilder';

export class HotelOperationsDeparturesReader {
    private _parsedQuery: HotelOperationsQueryDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public read(query: HotelOperationsQueryDO): Promise<HotelOperationsDeparturesInfo> {
        return new Promise<HotelOperationsDeparturesInfo>((resolve: { (result: HotelOperationsDeparturesInfo): void }, reject: { (err: ThError): void }) => {
            this.readCore(resolve, reject, query);
        });
    }

    private readCore(resolve: { (result: HotelOperationsDeparturesInfo): void }, reject: { (err: ThError): void }, query: HotelOperationsQueryDO) {
        var departuresInfoBuilder = new HotelOperationsDeparturesInfoBuilder();

        var queryParser = new HotelOperationsQueryDOParser(this._appContext, this._sessionContext);
        return queryParser.parse(query).then((parsedQuery: HotelOperationsQueryDO) => {
            this._parsedQuery = parsedQuery;

            var bookingRepository = this._appContext.getRepositoryFactory().getBookingRepository();
            return bookingRepository.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_ShowInDepartures,
                endDate: this._parsedQuery.referenceDate
            });
        }).then((bookingSearchResult: BookingSearchResultRepoDO) => {
            var bookingList = bookingSearchResult.bookingList;
            departuresInfoBuilder.appendBookingList(bookingList);

            var customerIdList: string[] = departuresInfoBuilder.getCustomerIdList();
            var customerValidator = new CustomerIdValidator(this._appContext, this._sessionContext);
            return customerValidator.validateCustomerIdList(customerIdList);
        }).then((customersContainer: CustomersContainer) => {
            departuresInfoBuilder.appendCustomerInformation(customersContainer);

            resolve(departuresInfoBuilder.getBuiltHotelOperationsDeparturesInfo());
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.HotelOperationsDeparturesReaderError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error getting hotel departures information", this._sessionContext, thError);
            }
            reject(thError);
        });
    }
}