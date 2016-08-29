import {ThLogger, ThLogLevel} from '../../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../../../utils/AppContext';
import {SessionContext} from '../../../../../../utils/SessionContext';
import {ValidationResultParser} from '../../../../../common/ValidationResultParser';
import {RoomSearchResultRepoDO} from '../../../../../../data-layer/rooms/repositories/IRoomRepository';
import {ThDateIntervalDO} from '../../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {BookingOccupancyCalculatorWrapperDO} from './BookingOccupancyCalculatorWrapperDO';
import {BookingOccupancyDO} from '../results/BookingOccupancyDO';
import {IBookingOccupancy} from '../results/IBookingOccupancy';
import {BookingOccupancyCalculator} from '../BookingOccupancyCalculator';

export class BookingOccupancyCalculatorWrapper {
    private _wrapperDO: BookingOccupancyCalculatorWrapperDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public compute(wrapperDO: BookingOccupancyCalculatorWrapperDO): Promise<BookingOccupancyDO> {
        this._wrapperDO = wrapperDO;
        return new Promise<BookingOccupancyDO>((resolve: { (result: BookingOccupancyDO): void }, reject: { (err: ThError): void }) => {
            this.computeCore(resolve, reject);
        });
    }

    private computeCore(resolve: { (result: BookingOccupancyDO): void }, reject: { (err: ThError): void }) {
        var validationResult = BookingOccupancyCalculatorWrapperDO.getValidationStructure().validateStructure(this._wrapperDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._wrapperDO);
            parser.logAndReject("Error validating occupancy calculator", reject);
            return;
        }
        var searchInterval = new ThDateIntervalDO();
        searchInterval.buildFromObject(this._wrapperDO.interval);
        if (!searchInterval.isValid()) {
            var thError = new ThError(ThStatusCode.BookingOccupancyCalculatorWrapperInvalidInterval, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "invalid submitted interval for booking occupancy calc", { sessionContext: this._sessionContext, wrapperDO: this._wrapperDO }, thError);
            reject(thError);
            return;
        }

        var roomsRepo = this._appContext.getRepositoryFactory().getRoomRepository();
        roomsRepo.getRoomList({ hotelId: this._sessionContext.sessionDO.hotel.id })
            .then((roomSearchResult: RoomSearchResultRepoDO) => {
                var occupancyCalculator = new BookingOccupancyCalculator(this._appContext, this._sessionContext, roomSearchResult.roomList);
                return occupancyCalculator.compute(searchInterval, [], this._wrapperDO.bookingIdToOmit);
            }).then((bookingOccupancy: IBookingOccupancy) => {
                resolve(bookingOccupancy.getBookingOccupancyDO());
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingOccupancyCalculatorWrapperError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error computing occupancy", { sessionContext: this._sessionContext, wrapperDO: this._wrapperDO }, thError);
                }
                reject(thError);
            });
    }
}