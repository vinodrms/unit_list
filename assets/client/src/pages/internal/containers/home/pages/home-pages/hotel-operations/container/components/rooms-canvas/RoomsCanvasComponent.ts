import {Component, Input, OnInit, NgZone} from '@angular/core';
import {RoomCardComponent} from './components/room-card/RoomCardComponent';

import {HotelOperationsDashboardService} from '../../services/HotelOperationsDashboardService';
import {IHotelOperationsDashboardRoomsCanvasMediator} from '../../HotelOperationsDashboardComponent';


import {RoomStatusType} from '../../shared/RoomStatusType';

import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {ThError} from '../../../../../../../../../../common/utils/responses/ThError';

declare var $: any;

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
	
	constructor(
		private _zone: NgZone,
		private _hotelOperationsDashboardService: HotelOperationsDashboardService,
		private _appContext: AppContext) {
		this.filterType = {
			currentValue : "All",
			newValue : "All"	
		};

		this._showNotificationBar = true;
		this.filterNotification = {
			Properties: {
				cssColor: 'green',
				textFirstPart: 'SHOWING ',
				textSecondPart: 'ALL ROOMS'
			}
		};
	}

	ngOnInit() {
		this.hotelOperationsDashboard.registerRoomsCanvas(this);
		this.refresh();
	}

	public filterTypeChanged(value){
		this.filterType.newValue = value;
		this.refresh();
	}

	public isNotificationBarVisible(){
		if (!this._showNotificationBar){
			return false;
		}
		else if (this.filterType.currentValue == "All") {
			return false;
		}
		return true;
	}
	
	public closeNotificationBar(){
		this._showNotificationBar = false;
		this.updateFilterNotification();
	}

	public refresh(){
		var date = this.hotelOperationsDashboard.getDate();
		this._hotelOperationsDashboardService.getRooms(this.filterType.newValue, date)
		.subscribe((rooms: any) => {
				this.filterType.currentValue = this.filterType.newValue;
				this._showNotificationBar = true;
				this.roomVMList = rooms;
				this.updateFilterNotification();
			}, (error: ThError) => {
				this._appContext.toaster.error(error.message);
			});
	}

	public updateFilterNotification(){
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

	public startedDragging(arrivalItemVM){

	}

	public dropHandled(event){
		var arrivalItem = this.hotelOperationsDashboard.getSelectedArrivalItem();
		var roomVM = event.roomVM;
		if (event.accepted){
			roomVM.Properties.Booking.ClientName = arrivalItem.ClientName;
			roomVM.Properties.Booking.NumberOfPeople = arrivalItem.NumberOfPeople;
			roomVM.Properties.Booking.NumberOfNights = arrivalItem.NumberOfNights;
			roomVM.Properties.Booking.Arrival = arrivalItem.Arrival;
			roomVM.Properties.Booking.Departure = arrivalItem.Departure;
			this.hotelOperationsDashboard.checkInArrivalItem(arrivalItem);
		}
	}

	public nextDay(){
		var date = Math.abs(this.hotelOperationsDashboard.getDate() + 1) % 3;
		this.hotelOperationsDashboard.setDate(date);
		this.hotelOperationsDashboard.refresh();
	}

	public previousDay(){
		var date = Math.abs(this.hotelOperationsDashboard.getDate() - 1) % 3;
		this.hotelOperationsDashboard.setDate(date);
		this.hotelOperationsDashboard.refresh();
	}
}