import {Observable} from 'rxjs/Observable';
import {AAssignRoomStrategy} from './AAssignRoomStrategy';
import {BookingDO} from '../../../../../../../../services/bookings/data-objects/BookingDO';
import {HotelOperationsRoomService} from '../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import {AssignRoomParam} from '../../../../../../../../services/hotel-operations/room/utils/AssignRoomParam';

export class ReserveRoomStrategy extends AAssignRoomStrategy {
    public getStrategyButtonText(): string {
        return "Reserve Room";
    }
    public applyStrategy(operationsRoomService: HotelOperationsRoomService, assignRoomParams: AssignRoomParam): Observable<BookingDO> {
        return operationsRoomService.reserveRoom(assignRoomParams);
    }
    public getStrategySuccessResultString(): string {
        return "The room was reserved succesfully.";
    }
    public validateAlreadyCheckedInBooking(): boolean {
        return false;
    }
    public getEventAction(): string {
        return "reserve-room";
    }
}