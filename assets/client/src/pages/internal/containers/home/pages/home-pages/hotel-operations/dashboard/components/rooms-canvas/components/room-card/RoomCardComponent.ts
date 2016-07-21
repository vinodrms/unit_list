import {Component, Input, Output, NgZone, ElementRef, EventEmitter} from '@angular/core';
import {RoomDropHandlerFactory} from './drop-handlers/RoomDropHandlerFactory';

import {RoomItemInfoVM} from '../../../../../../../../../../services/hotel-operations/dashboard/rooms/view-models/RoomItemInfoVM';
import {ArrivalItemInfoVM} from '../../../../../../../../../../services/hotel-operations/dashboard/arrivals/view-models/ArrivalItemInfoVM';

import {AssignRoomParam} from '../../../../../../../../../../services/hotel-operations/room/utils/AssignRoomParam';
import {HotelOperationsRoomService} from '../../../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService';

import {RoomsCanvasComponent} from '../../../rooms-canvas/RoomsCanvasComponent';
// import {HeaderPageService} from '../../../utils/header/container/services/HeaderPageService';

declare var $: any;

export class MaintenanceStatusType {
	static Dirty = "Dirty";
	static PickUp = "PickUp";
	static None = "None"
}

@Component({
	selector: 'room-card',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/dashboard/components/rooms-canvas/components/room-card/template/room-card.html'
})

export class RoomCardComponent {
	public maintenance;
	@Input() roomCanvas: RoomsCanvasComponent;
	@Input() roomVM: RoomItemInfoVM;
	@Output() dropped = new EventEmitter();

	constructor(
		private _zone: NgZone,
		private _root: ElementRef,
		private _operationRoomService: HotelOperationsRoomService
		) {
		this.maintenance = undefined;
	}

	private buildMaintenanceObject(maintenanceStatus) {
		switch (maintenanceStatus) {
			case MaintenanceStatusType.Dirty:
				this.maintenance = {
					cssClass: 'orange-color',
					title: 'Dirty',
					icon: ',',
					clickHandler: () => {
						alert("Dirty clicked");
					}
				}

				break;

			// case MaintenanceStatusType.PickUp:
			// 	this.maintenance = {
			// 		cssClass: 'stat-tomato',
			// 		title: 'Pickup',
			// 		icon: 'F',
			// 		clickHandler: () => {
			// 			alert("Pickup clicked");
			// 		}
			// 	}
			// 	break;
			default:
				this.maintenance = undefined
				break;
		}
	}

	ngOnInit() {
		// this.buildMaintenanceObject(this.roomVM.properties.maintenanceStatus);
	}

	ngAfterViewInit() {
		$(this._root.nativeElement).find('.room-card').droppable(
			{
				accept: 'arrival-item',
				drop: (event: Event, ui: Object) => {
					this._zone.run(() => {
						var arrivalItem:ArrivalItemInfoVM = this.roomCanvas.getSelectedArrivalItem();
						var dropHandler = RoomDropHandlerFactory.get(this.roomVM.status);
						var outcome = {
							accepted: dropHandler.handle(arrivalItem),
							roomVM: this.roomVM
						}

						if (outcome.accepted == true) {
							var assignRoomParams:AssignRoomParam = {
								groupBookingId: arrivalItem.arrivalItemDO.groupBookingId,
								bookingId: arrivalItem.arrivalItemDO.bookingId,
								roomId: this.roomVM.roomVM.room.id,
								roomCategoryId: this.roomVM.roomVM.room.categoryId
							};
							this._operationRoomService.checkIn(assignRoomParams).subscribe((r)=>{
								this.dropped.emit(outcome);
							})
						}
						else {
							this.dropped.emit(outcome)
						}
					})
				}
			}
		);
	}
}