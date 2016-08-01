import {Observable} from 'rxjs/Observable';
import {AAssignRoomStrategy} from './AAssignRoomStrategy';
import {BookingDO} from '../../../../../../../../services/bookings/data-objects/BookingDO';
import {HotelOperationsRoomService} from '../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import {AssignRoomParam} from '../../../../../../../../services/hotel-operations/room/utils/AssignRoomParam';

export class ChangeRoomStrategy extends AAssignRoomStrategy {
    public getStrategyButtonText(): string {
        return "Change Room";
    }
    public applyStrategy(operationsRoomService: HotelOperationsRoomService, assignRoomParams: AssignRoomParam): Observable<BookingDO> {
        return operationsRoomService.changeRoom(assignRoomParams);
    }
    public getStrategySuccessResultString(): string {
        return "Room was changed succesfully";
    }
    public validateAlreadyCheckedInBooking(): boolean {
        return true;
    }
}