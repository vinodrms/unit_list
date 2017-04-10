import {Injectable, ReflectiveInjector} from '@angular/core';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {BookingDO} from '../../../../../../../services/bookings/data-objects/BookingDO';
import {AssignRoomParam} from './utils/AssignRoomParam';
import {AssignRoomModalInput} from './utils/AssignRoomModalInput';
import {AssignRoomModalComponent} from '../AssignRoomModalComponent';
import {AssignRoomModalModule} from '../AssignRoomModalModule';
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
    public changeRoom(assignRoomParam: AssignRoomParam, oldRoomId: string): Promise<ModalDialogRef<BookingDO>> {
        return this.assignRoom(new ChangeRoomStrategy(), assignRoomParam, oldRoomId);
    }

    private assignRoom(assignRoomStrategy: IAssignRoomStrategy, assignRoomParam: AssignRoomParam, oldRoomId?: string): Promise<ModalDialogRef<BookingDO>> {
        var assignRoomModalInput = new AssignRoomModalInput(assignRoomStrategy, assignRoomParam);
        if (!this._appContext.thUtils.isUndefinedOrNull(oldRoomId)) {
            assignRoomModalInput.oldRoomId = oldRoomId;
        }
        return this._appContext.modalService.open<any>(AssignRoomModalModule, AssignRoomModalComponent, ReflectiveInjector.resolve([
            { provide: AssignRoomModalInput, useValue: assignRoomModalInput }
        ]));
    }
}