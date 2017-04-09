import {Injectable, ReflectiveInjector} from '@angular/core';
import {AppContext} from '../../../../../../../../../../../../../../common/utils/AppContext';
import {RoomMaintenanceStatusModalComponent} from '../RoomMaintenanceStatusModalComponent';
import {RoomMaintenanceStatusModalModule} from '../RoomMaintenanceStatusModalModule';
import {RoomMaintenanceStatusModalInput} from '../utils/RoomMaintenanceStatusModalInput';
import {RoomVM} from '../../../../../../../../../../../../services/rooms/view-models/RoomVM';
import {HotelOperationsRoomService} from '../../../../../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import {ModalDialogRef} from '../../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {RoomMaintenanceMeta} from '../../../../../../../../../../../../services/rooms/utils/RoomMaintenanceMeta';

@Injectable()
export class RoomMaintenanceStatusModalService {
	constructor(private _appContext: AppContext) { }
	public openRoomMaintenanceStatusModal(roomVM: RoomVM, hotelOperationsRoomService: HotelOperationsRoomService, roomMaintenanceMetaList?: RoomMaintenanceMeta[]): Promise<ModalDialogRef<boolean>> {
        var roomMaintenanceStatusModalInput = new RoomMaintenanceStatusModalInput(roomVM, roomMaintenanceMetaList);
		return this._appContext.modalService.open<any>(RoomMaintenanceStatusModalModule, RoomMaintenanceStatusModalComponent, ReflectiveInjector.resolve([
            { provide: HotelOperationsRoomService, useValue: hotelOperationsRoomService }, { provide: RoomMaintenanceStatusModalInput, useValue: roomMaintenanceStatusModalInput }
		]));
	}
}