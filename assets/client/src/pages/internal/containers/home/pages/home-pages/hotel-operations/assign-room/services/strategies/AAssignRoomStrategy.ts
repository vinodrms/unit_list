import {Observable} from 'rxjs/Observable';
import {IAssignRoomStrategy} from './IAssignRoomStrategy';
import {BookingDO} from '../../../../../../../../services/bookings/data-objects/BookingDO';
import {HotelOperationsRoomService} from '../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import {AssignRoomParam} from '../../../../../../../../services/hotel-operations/room/utils/AssignRoomParam';

export abstract class AAssignRoomStrategy implements IAssignRoomStrategy {
    public abstract getStrategyButtonText(): string;
    public abstract applyStrategy(operationsRoomService: HotelOperationsRoomService, assignRoomParams: AssignRoomParam): Observable<BookingDO>;
    public abstract getStrategySuccessResultString(): string;
    public abstract validateAlreadyCheckedInBooking(): boolean;
}