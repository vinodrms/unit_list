import {Injectable, ReflectiveInjector, provide} from '@angular/core';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {BookingDO} from '../../../../../../../services/bookings/data-objects/BookingDO';
import {AssignRoomParam} from './utils/AssignRoomParam';
import {AssignRoomModalInput} from './utils/AssignRoomModalInput';
import {AssignRoomModalComponent} from '../AssignRoomModalComponent';
import {IAssignRoomStrategy} from './strategies/IAssignRoomStrategy';
import {CheckInStrategy} from './strategies/CheckInStrategy';
import {ReserveRoomStrategy} from './strategies/ReserveRoomStrategy';
import {ChangeRoomStrategy} from './strategies/ChangeRoomStrategy';

@Injectable()
export class AssignRoomModalService {
    constructor(private _appContext: AppContext) { }

    public checkIn(assignRoomParam: AssignRoomParam): Promise<ModalDialogRef<BookingDO>> {
        return this.assignRoom(new CheckInStrategy(), assignRoomParam);
    }
    public reserveRoom(assignRoomParam: AssignRoomParam): Promise<ModalDialogRef<BookingDO>> {
        return this.assignRoom(new ReserveRoomStrategy(), assignRoomParam);
    }
    public changeRoom(assignRoomParam: AssignRoomParam): Promise<ModalDialogRef<BookingDO>> {
        return this.assignRoom(new ChangeRoomStrategy(), assignRoomParam);
    }

    private assignRoom(assignRoomStrategy: IAssignRoomStrategy, assignRoomParam: AssignRoomParam): Promise<ModalDialogRef<BookingDO>> {
        var assignRoomModalInput = new AssignRoomModalInput(assignRoomStrategy, assignRoomParam);
        return this._appContext.modalService.open<any>(<any>AssignRoomModalComponent, ReflectiveInjector.resolve([
            provide(AssignRoomModalInput, { useValue: assignRoomModalInput })
        ]));
    }
}