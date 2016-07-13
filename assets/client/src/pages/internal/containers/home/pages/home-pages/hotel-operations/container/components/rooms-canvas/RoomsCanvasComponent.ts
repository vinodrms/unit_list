import {Component, Input, OnInit, NgZone} from '@angular/core';
import {RoomCardComponent} from './components/room-card/RoomCardComponent';

import {HotelOperationsDashboardService} from '../../services/HotelOperationsDashboardService';
import {IHotelOperationsDashboardRoomsCanvasMediator} from '../../HotelOperationsDashboardComponent';


import {RoomStatusType} from '../../shared/RoomStatusType';

import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {ThError} from '../../../../../../../../../../common/utils/responses/ThError';

declare var $: any;
declare var _: any;

@Component({
	selector: 'rooms-canvas',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/container/components/rooms-canvas/template/rooms-canvas.html',
	providers: [HotelOperationsDashboardService],
	directives: [RoomCardComponent]
})

export class RoomsCanvasComponent implements OnInit {
	@Input() hotelOperationsDashboard: IHotelOperationsDashboardRoomsCanvasMediator;

	public filterType;
	public roomVMList: any[];
	public filterNotification;

	private _showNotificationBar;
	private dragStyles;

	constructor(
		private _zone: NgZone,
		private _hotelOperationsDashboardService: HotelOperationsDashboardService,
		private _appContext: AppContext) {
		this.filterType = {
			currentValue: "All",
			newValue: "All"
		};

		this._showNotificationBar = true;
		this.filterNotification = {
			Properties: {
				cssColor: 'green',
				textFirstPart: 'SHOWING ',
				textSecondPart: 'ALL ROOMS'
			}
		};

		this.dragStyles = {
			canCheckIn : {
				tickBorder : true,
				ghost: false,
				acceptDrop: true
			},
			canUpgrade : {
				tickBorder : false,
				ghost: true,
				acceptDrop: true
			},
			canNotCheckIn : {
				tickBorder : false,
				ghost: true,
				acceptDrop: false
			},
			default: {
				tickBorder : false,
				ghost: false,
				acceptDrop: false
			}
		}

	}

	ngOnInit() {
		this.hotelOperationsDashboard.registerRoomsCanvas(this);
		this.refresh();
	}

	public filterTypeChanged(value) {
		this.filterType.newValue = value;
		this.refresh();
	}

	public isNotificationBarVisible() {
		if (!this._showNotificationBar) {
			return false;
		}
		else if (this.filterType.currentValue == "All") {
			return false;
		}
		return true;
	}

	public closeNotificationBar() {
		this._showNotificationBar = false;
		this.updateFilterNotification();
	}

	public refresh() {
		console.log("Refresh");
		var date = this.hotelOperationsDashboard.getDate();
		this._hotelOperationsDashboardService.getRooms(this.filterType.newValue, date)
			.subscribe((rooms: any) => {
				console.log("Refresh callback");
				this.setRoomsUIHighlight(rooms, this.dragStyles.default);
				this.filterType.currentValue = this.filterType.newValue;
				this._showNotificationBar = true;
				this.roomVMList = rooms;
				this.updateFilterNotification();
			}, (error: ThError) => {
				this._appContext.toaster.error(error.message);
			});
	}

	private setRoomsUIHighlight(rooms, value:any) {
		rooms.forEach(room => {
			room["UI"] = {
				tickBorder : value.tickBorder,
				ghost: value.ghost,
				acceptDrop: value.acceptDrop
			}
		});
	}

	public updateFilterNotification() {
		switch (this.filterType.currentValue) {
			case RoomStatusType.Free:
				this.filterNotification.Properties = {
					cssColor: 'green',
					textFirstPart: 'SHOWING ONLY ',
					textSecondPart: 'FREE ROOMS'
				}
				break;
			case RoomStatusType.Occupied:
				this.filterNotification.Properties = {
					cssColor: 'orange',
					textFirstPart: 'SHOWING ONLY ',
					textSecondPart: 'OCCUPIED ROOMS'
				}
				break;
			case RoomStatusType.Reserved:
				this.filterNotification.Properties = {
					cssColor: 'yellow',
					textFirstPart: 'SHOWING ONLY ',
					textSecondPart: 'RESERVED ROOMS'
				}
				break;
			case RoomStatusType.OutOfService:
				this.filterNotification.Properties = {
					cssColor: 'gray',
					textFirstPart: 'SHOWING ONLY ',
					textSecondPart: 'OUT OF SERVICE ROOMS'
				}
				break;
			default:
				this.filterNotification.Properties = {
					cssColor: 'green',
					textFirstPart: 'SHOWING ',
					textSecondPart: 'ALL ROOMS'
				}
				break;
		}
	}

	public startedDragging(arrivalItemVM) {
		var canCheckInRoomVmList = [];
		var canNotCheckInRoomVmList = [];
		var canUpgradeCheckInRoomVMList = [];

		this.roomVMList.forEach(currentRoom => {
			if (currentRoom.Type == arrivalItemVM.roomType && currentRoom.status == "Free") {
				canCheckInRoomVmList.push(currentRoom);
			}
			else if (currentRoom.Type != arrivalItemVM.roomType && currentRoom.status == "Free") {
				canUpgradeCheckInRoomVMList.push(currentRoom);
			}
			else {
				canNotCheckInRoomVmList.push(currentRoom);
			}
		});

		// Default
		this.setRoomsUIHighlight(canCheckInRoomVmList, this.dragStyles.canCheckIn);
		this.setRoomsUIHighlight(canUpgradeCheckInRoomVMList, this.dragStyles.canUpgrade);
		this.setRoomsUIHighlight(canNotCheckInRoomVmList, this.dragStyles.canNotCheckIn);
	}

	public dropHandled(event) {
		var arrivalItem = this.hotelOperationsDashboard.getSelectedArrivalItem();
		var roomVM = event.roomVM;
		if (event.accepted) {
			roomVM.properties.booking.clientName = arrivalItem.clientName;
			roomVM.properties.booking.numberOfPeople = arrivalItem.numberOfPeople;
			roomVM.properties.booking.numberOfNights = arrivalItem.numberOfNights;
			roomVM.properties.booking.arrival = arrivalItem.arrival;
			roomVM.properties.booking.departure = arrivalItem.departure;
			this.hotelOperationsDashboard.checkInArrivalItem(arrivalItem);
			this.setRoomsUIHighlight(this.roomVMList, this.dragStyles.default);
		}
	}

	public stoppedDragging(arrivalItemVM){
		this.setRoomsUIHighlight(this.roomVMList, this.dragStyles.default);
	}

	public nextDay() {
		var date = Math.abs(this.hotelOperationsDashboard.getDate() + 1) % 3;
		this.hotelOperationsDashboard.setDate(date);
		this.hotelOperationsDashboard.refresh();
	}

	public previousDay() {
		var date = Math.abs(this.hotelOperationsDashboard.getDate() - 1) % 3;
		this.hotelOperationsDashboard.setDate(date);
		this.hotelOperationsDashboard.refresh();
	}
}