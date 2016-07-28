import {Component, Input, OnInit, NgZone} from '@angular/core';
import {RoomCardComponent} from './components/room-card/RoomCardComponent';

import {HotelOperationsDashboardService} from '../../../../../../../../services/hotel-operations/dashboard/HotelOperationsDashboardService';
import {IHotelOperationsDashboardRoomsCanvasMediator} from '../../HotelOperationsDashboardComponent';
import {HotelService} from '../../../../../../../../services/hotel/HotelService';

import {HotelDetailsDO} from '../../../../../../../../services/hotel/data-objects/HotelDetailsDO';
import {ArrivalItemInfoVM} from '../../../../../../../../services/hotel-operations/dashboard/arrivals/view-models/ArrivalItemInfoVM';
import {RoomItemInfoVM, RoomItemInfoVM_UI_Properties} from '../../../../../../../../services/hotel-operations/dashboard/rooms/view-models/RoomItemInfoVM';
import {RoomItemInfoDO, RoomItemStatus} from '../../../../../../../../services/hotel-operations/dashboard/rooms/data-objects/RoomItemInfoDO';

import {FilterValueType, IDragStyles, IFilterNotificationProperties, IFilterNotification, IFilterValue} from './utils/RoomsCanvasInterfaces';
import {RoomsCanvasUtils} from './utils/RoomsCanvasUtils';

import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {ThError} from '../../../../../../../../../../common/utils/responses/ThError';

import {ThDateDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateDO';

import {CustomScroll} from '../../../../../../../../../../../src/common/utils/directives/CustomScroll';

declare var $: any;
declare var _: any;

@Component({
	selector: 'rooms-canvas',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/dashboard/components/rooms-canvas/template/rooms-canvas.html',
	providers: [RoomsCanvasUtils],
	directives: [CustomScroll, RoomCardComponent]
})
export class RoomsCanvasComponent implements OnInit {
	@Input() hotelOperationsDashboard: IHotelOperationsDashboardRoomsCanvasMediator;

	public self:RoomsCanvasComponent;
	public filterValue: IFilterValue;
	public filteredRoomVMList: RoomItemInfoVM[];
	public filterNotification: IFilterNotification;
	public currentDate: ThDateDO;

	public enums;
	private dragStyles: IDragStyles;

	private _showNotificationBar:boolean;

	constructor(
		private _zone: NgZone,
		private _hotelOperationsDashboardService: HotelOperationsDashboardService,
		private _hotelService:HotelService,
		private _utils: RoomsCanvasUtils,
		private _appContext: AppContext) {
		
		this._showNotificationBar = true;
		this.self = this;
		
		this.filterValue = {
			currentValue: FilterValueType.All,
			newValue: FilterValueType.All
		};

		this.dragStyles = this._utils.dragStyles;

		this.enums = {
			FilterValueType: FilterValueType
		}

		// this.currentDate = ThDateDO.buildThDateDO(2016, 6, 27);

		this.updateFilterNotification();
	}

	ngOnInit() {
		this.hotelOperationsDashboard.registerRoomsCanvas(this);
		this._hotelService.getHotelDetailsDO().subscribe((details: HotelDetailsDO)=>{
			this.currentDate = details.currentThTimestamp.thDateDO.buildPrototype();
			this._hotelOperationsDashboardService.getRoomItems().subscribe((r: any) =>{
				this._utils.setRoomsUIHighlight(r, this.dragStyles.default);
				this.filterValue.currentValue = this.filterValue.newValue;
				this._showNotificationBar = true;
				this.filteredRoomVMList = this._utils.filterRoomsByStateType(this.filterValue.currentValue, r);
				this.updateFilterNotification();
			}, (error:any) => {
				this._appContext.toaster.error(error.message);
			});

		})
	}	

	public refresh() {
		this._hotelOperationsDashboardService.refreshRooms();
	}

	public startedDragging(arrivalItemVM: ArrivalItemInfoVM) {
		var canCheckInRoomVmList:RoomItemInfoVM[] = [];
		var canNotCheckInRoomVmList:RoomItemInfoVM[] = [];
		var canUpgradeCheckInRoomVMList:RoomItemInfoVM[] = [];

		this.filteredRoomVMList.forEach(currentRoom => {
			if (this.testCanCheckIn(currentRoom, arrivalItemVM)){
				canCheckInRoomVmList.push(currentRoom);
			}
			else if (this.testCanUpgrade(currentRoom, arrivalItemVM)){
				canUpgradeCheckInRoomVMList.push(currentRoom);
			}
			else {
				canNotCheckInRoomVmList.push(currentRoom);
			}
		});
		
		this._utils.setRoomsUIHighlight(canCheckInRoomVmList, this.dragStyles.canCheckIn);
		this._utils.setRoomsUIHighlight(canUpgradeCheckInRoomVMList, this.dragStyles.canUpgrade);
		this._utils.setRoomsUIHighlight(canNotCheckInRoomVmList, this.dragStyles.canNotCheckIn);
	}

	private testCanCheckIn(room:RoomItemInfoVM, arrivalItem: ArrivalItemInfoVM){
		if (
			room.canFit(arrivalItem.bookingCapacity) &&
			room.roomVM.category.id == arrivalItem.reservedRoomCategoryStats.roomCategory.id &&
			room.status == RoomItemStatus.Free
		){
			return true;
		}
		return false;
	}

	private testCanUpgrade(room:RoomItemInfoVM, arrivalItem: ArrivalItemInfoVM){
		if (
			room.canFit(arrivalItem.bookingCapacity) &&
			room.status == RoomItemStatus.Free
		){
			return true;
		}
		return false;
	}

	public dropHandled(event) {
		var arrivalItem = this.hotelOperationsDashboard.getSelectedArrivalItem();
		var roomVM = event.roomVM;
		if (event.accepted) {
			this.hotelOperationsDashboard.checkInArrivalItem(arrivalItem);
			this._utils.setRoomsUIHighlight(this.filteredRoomVMList, this.dragStyles.default);
		}
	}

	public getSelectedArrivalItem():ArrivalItemInfoVM{
		return this.hotelOperationsDashboard.getSelectedArrivalItem();
	}	

	public filterValueChanged(value) {
		this.filterValue.newValue = parseInt(value);
		this.refresh();
	}

	public isNotificationBarVisible() {
		if (!this._showNotificationBar) {
			return false;
		}
		else if (this.filterValue.currentValue == FilterValueType.All) {
			return false;
		}
		return true;
	}

	public closeNotificationBar() {
		this._showNotificationBar = false;
		this.updateFilterNotification();
	}

	public updateFilterNotification() {
		var properties = this._utils.getfilterNotificationProperties(this.filterValue.currentValue);
		if (!this.filterNotification){
			this.filterNotification = {
				Properties : properties
			}
		}
		else{
			this.filterNotification.Properties = properties;
		} 
	}

	public stoppedDragging(arrivalItemVM){
		this._utils.setRoomsUIHighlight(this.filteredRoomVMList, this.dragStyles.default);
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

	public getDateShortString() {
		return this.currentDate.getShortDisplayString(this._appContext.thTranslation);
	}	
}