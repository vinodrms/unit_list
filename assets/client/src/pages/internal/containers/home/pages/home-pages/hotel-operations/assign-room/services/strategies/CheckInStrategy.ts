import {Observable} from 'rxjs/Observable';
import {AAssignRoomStrategy} from './AAssignRoomStrategy';
import {BookingDO} from '../../../../../../../../services/bookings/data-objects/BookingDO';
import {HotelOperationsRoomService} from '../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import {AssignRoomParam} from '../../../../../../../../services/hotel-operations/room/utils/AssignRoomParam';

export class CheckInStrategy extends AAssignRoomStrategy {
    public getStrategyButtonText(): string {
        return "Check In";
    }
    public applyStrategy(operationsRoomService: HotelOperationsRoomService, assignRoomParams: AssignRoomParam): Observable<BookingDO> {
        return operationsRoomService.checkIn(assignRoomParams);
    }
    public getStrategySuccessResultString(): string {
        return "The check in was made succesfully. If you changed the default room and want to bill this, you can add on the invoice Upgrade/Downgrade Add On Products.";
    }
    public validateAlreadyCheckedInBooking(): boolean {
        return true;
    }
}