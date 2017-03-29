import {Injectable, ReflectiveInjector} from '@angular/core';
import {AppContext} from "../../../../../../../../../../../../common/utils/AppContext"
import {RoomCategoryItemDO} from "../../../../../../../../../../../../pages/internal/containers/home/pages/utils/new-booking/services/search/data-objects/room-category-item/RoomCategoryItemDO"
import {RoomAvailabilityModalComponent} from '../RoomAvailabilityModalComponent'
import {RoomAvailabilityModalModule} from '../RoomAvailabilityModalModule'
import {RoomAvailabilityModalInput} from '../util/RoomAvailabilityModalInput'

@Injectable()
export class RoomAvailabilityModalService {
    constructor(private _appContext: AppContext) { }


    public openNewRoomAvailabilityModal(roomCategoryItemList: RoomCategoryItemDO[]) {
        var roomAvailabilityModalInput = new RoomAvailabilityModalInput(roomCategoryItemList);
        return this._appContext.modalService.open<any>(RoomAvailabilityModalModule, RoomAvailabilityModalComponent, ReflectiveInjector.resolve([
            { provide: RoomAvailabilityModalInput, useValue: roomAvailabilityModalInput }
        ]));
    }
}