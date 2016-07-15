import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {ThTimestampDO} from '../../../../utils/th-dates/data-objects/ThTimestampDO';
import {BookingDO} from '../../../../data-layer/bookings/data-objects/BookingDO';
import {BookingDOConstraints} from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import {BookingSearchResultRepoDO} from '../../../../data-layer/bookings/repositories/IBookingRepository';
import {HotelTime} from '../../common/hotel-time/HotelTime';
import {CustomerIdValidator} from '../../../customers/validators/CustomerIdValidator';
import {CustomersContainer} from '../../../customers/validators/results/CustomersContainer';
import {HotelOperationsRoomInfo} from './utils/HotelOperationsRoomInfo';
import {HotelOperationsRoomInfoBuilder} from './utils/HotelOperationsRoomInfoBuilder';

export class HotelOperationsRoomInfoReader {
    private _currentHotelTimestamp: ThTimestampDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public read(): Promise<HotelOperationsRoomInfo> {
        return new Promise<HotelOperationsRoomInfo>((resolve: { (result: HotelOperationsRoomInfo): void }, reject: { (err: ThError): void }) => {
            this.readCore(resolve, reject);
        });
    }

    private readCore(resolve: { (result: HotelOperationsRoomInfo): void }, reject: { (err: ThError): void }) {
        var roomInfoBuilder = new HotelOperationsRoomInfoBuilder();

        var hotelTime = new HotelTime(this._appContext, this._sessionContext);
        hotelTime.getTimestamp().then((timestamp: ThTimestampDO) => {
            this._currentHotelTimestamp = timestamp;

            var bookingRepository = this._appContext.getRepositoryFactory().getBookingRepository();
            return bookingRepository.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_CheckedId
            });
        }).then((checkedInSearchResult: BookingSearchResultRepoDO) => {
            var checkedInBookingList: BookingDO[] = checkedInSearchResult.bookingList;
            roomInfoBuilder.appendCheckedInBookingList(checkedInBookingList);

            var bookingRepository = this._appContext.getRepositoryFactory().getBookingRepository();
            return bookingRepository.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_CanBeCheckedIn,
                startDate: this._currentHotelTimestamp.thDateDO
            });
        }).then((canBeCheckedInSearchResult: BookingSearchResultRepoDO) => {
            var canBeCheckedInBookingList: BookingDO[] = canBeCheckedInSearchResult.bookingList;
            roomInfoBuilder.appendCanBeCheckedInBookingList(canBeCheckedInBookingList);

            var customerIdList: string[] = roomInfoBuilder.getCustomerIdList();
            var customerValidator = new CustomerIdValidator(this._appContext, this._sessionContext);
            return customerValidator.validateCustomerIdList(customerIdList);
        }).then((customersContainer: CustomersContainer) => {
            roomInfoBuilder.appendCustomerInformation(customersContainer);

            var roomInfo = roomInfoBuilder.getBuiltHotelOperationsRoomInfo();
            roomInfo.referenceDate = this._currentHotelTimestamp.thDateDO;
            resolve(roomInfo);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.HotelOperationsRoomInfoReaderError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error getting hotel information", this._sessionContext, thError);
            }
            reject(thError);
        });
    }
}