import {Component, Input, Output, NgZone, ElementRef, EventEmitter} from '@angular/core';
import {RoomDropHandlerFactory} from './drop-handlers/RoomDropHandlerFactory';

import {HotelOperationsRoomService} from '../../../../../../../../../../services/hotel-operations/room/HotelOperationsRoomService';

// import {HeaderPageService} from '../../../utils/header/container/services/HeaderPageService';

declare var $: any;

export class MaintenanceStatusType {
	static Dirty = "Dirty";
	static PickUp = "PickUp";
	static None = "None"
}

@Component({
	selector: 'room-card',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/container/components/rooms-canvas/components/room-card/template/room-card.html'
})

export class RoomCardComponent {
	public maintenance;
	@Input() roomVM: any;
	@Output() dropped = new EventEmitter();

	constructor(
		private _zone: NgZone,
		private _root: ElementRef
		// private _operationRoomService: HotelOperationsRoomService
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
						var dropHandler = RoomDropHandlerFactory.get(this.roomVM.status.displayName);
						var outcome = {
							accepted: dropHandler.handle("test"),
							roomVM: this.roomVM
						}

						if (outcome.accepted == true) {
							this.roomVM.status.value = "Occupied";
							this.dropped.emit(outcome);
							// this._operationRoomService.checkIn();
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