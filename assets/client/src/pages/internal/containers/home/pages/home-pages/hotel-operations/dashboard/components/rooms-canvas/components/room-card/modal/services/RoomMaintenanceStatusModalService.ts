import {Injectable, ReflectiveInjector} from '@angular/core';
import {AppContext} from '../../../../../../../../../../../../../../common/utils/AppContext';
import {RoomMaintenanceStatusModalComponent} from '../RoomMaintenanceStatusModalComponent';
import {RoomMaintenanceStatusModalModule} from '../RoomMaintenanceStatusModalModule';
import {RoomMaintenanceStatusModalInput} from '../utils/RoomMaintenanceStatusModalInput';
import {RoomVM} from '../../../../../../../../../../../../services/rooms/view-models/RoomVM';
import {HotelOperationsRoomService} from '../../../../../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService';

@Injectable()
export class RoomMaintenanceStatusModalService {
	constructor(private _appContext: AppContext) { }
	public openRoomMaintenanceStatusModal(roomVM: RoomVM, hotelOperationsRoomService: HotelOperationsRoomService): Promise<any> {
        var roomMaintenanceStatusModalInput = new RoomMaintenanceStatusModalInput(roomVM, hotelOperationsRoomService);
		return this._appContext.modalService.open<any>(RoomMaintenanceStatusModalModule, RoomMaintenanceStatusModalComponent, ReflectiveInjector.resolve([
            { provide: RoomMaintenanceStatusModalInput, useValue: roomMaintenanceStatusModalInput }
		]));
	}
}