import {Observable} from 'rxjs/Observable';
import {BookingDO} from '../../../../../../../../services/bookings/data-objects/BookingDO';
import {HotelOperationsRoomService} from '../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import {AssignRoomParam} from '../../../../../../../../services/hotel-operations/room/utils/AssignRoomParam';

export interface IAssignRoomStrategy {
    getStrategyButtonText(): string;
    applyStrategy(operationsRoomService: HotelOperationsRoomService, assignRoomParams: AssignRoomParam): Observable<BookingDO>;
    getStrategySuccessResultString(): string;
    validateAlreadyCheckedInBooking(): boolean;
    getEventAction(): string;
}