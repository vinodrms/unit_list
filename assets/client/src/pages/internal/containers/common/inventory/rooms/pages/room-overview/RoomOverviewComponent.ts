import { Component, Input, Output, EventEmitter } from '@angular/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {RoomVM} from '../../../../../../services/rooms/view-models/RoomVM';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {HotelOperationsModalService} from '../../../../../home/pages/home-pages/hotel-operations/operations-modal/services/HotelOperationsModalService';
import {HotelOperationsResult} from '../../../../../home/pages/home-pages/hotel-operations/operations-modal/services/utils/HotelOperationsResult';

@Component({
    selector: 'room-overview',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/rooms/pages/room-overview/template/room-overview.html',
    providers: [HotelOperationsModalService]
})
export class RoomOverviewComponent extends BaseComponent {
	@Input() showLinkToOperationalModal: boolean = false;

    constructor(private _hotelOperationsModalService: HotelOperationsModalService) {
        super();
    }

    private _roomVM: RoomVM;
	public get roomVM(): RoomVM {
		return this._roomVM;
	}

	@Input()
	public set roomVM(roomVM: RoomVM) {
		this._roomVM = roomVM;
	}

    @Output() onEdit = new EventEmitter();
	public editRoom() {
		this.onEdit.next(this._roomVM);
	}

	public openRoomOperationsModal() {
		this._hotelOperationsModalService.openRoomOperationsModal(this._roomVM.room.id).then((modalDialogRef: ModalDialogRef<HotelOperationsResult>) => {
			modalDialogRef.resultObservable
				.subscribe((result: HotelOperationsResult) => {
				}, (err: any) => {
				});
		}).catch((err: any) => { });
	}
}