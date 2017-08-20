import { Component, Input, OnInit, NgZone, AfterViewInit, ViewChild } from '@angular/core';
import { AppContext } from '../../../../../../../../../../common/utils/AppContext';
import { ThError } from '../../../../../../../../../../common/utils/responses/ThError';
import { ThDateDO } from '../../../../../../../../services/common/data-objects/th-dates/ThDateDO';

import { HotelOperationsDashboardService } from '../../../../../../../../services/hotel-operations/dashboard/HotelOperationsDashboardService';
import { IHotelOperationsDashboardRoomsCanvasMediator } from '../../HotelOperationsDashboardComponent';
import { HotelService } from '../../../../../../../../services/hotel/HotelService';
import { HotelDetailsDO } from '../../../../../../../../services/hotel/data-objects/HotelDetailsDO';
import { ArrivalItemInfoVM } from '../../../../../../../../services/hotel-operations/dashboard/arrivals/view-models/ArrivalItemInfoVM';
import { RoomItemInfoVM, RoomItemInfoVM_UI_Properties } from '../../../../../../../../services/hotel-operations/dashboard/rooms/view-models/RoomItemInfoVM';
import { RoomItemInfoDO, RoomItemStatus } from '../../../../../../../../services/hotel-operations/dashboard/rooms/data-objects/RoomItemInfoDO';

import { FilterValueType, IDragStyles, IFilterNotificationProperties, IFilterNotification, IFilterValue } from './utils/RoomsCanvasInterfaces';
import { RoomsCanvasUtils } from './utils/RoomsCanvasUtils';
import { CustomScroll } from "../../../../../../../../../../common/utils/directives/CustomScroll";

import * as _ from "underscore";

declare var $: any;

@Component({
	selector: 'rooms-canvas',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/dashboard/components/rooms-canvas/template/rooms-canvas.html',
	providers: [RoomsCanvasUtils]
})
export class RoomsCanvasComponent implements OnInit, AfterViewInit {
	@Input() hotelOperationsDashboard: IHotelOperationsDashboardRoomsCanvasMediator;
	@ViewChild(CustomScroll) private scrollableRoomsCanvas: CustomScroll;

	private static scrollTimeout = 100;
	private lowerScrollInterval: number;
	private upperScrollInterval: number;

	public self: RoomsCanvasComponent;
	public filterValue: IFilterValue;
	public filteredRoomVMList: RoomItemInfoVM[];
	public filterNotification: IFilterNotification;
	public currentDate: ThDateDO;

	public enums;
	private dragStyles: IDragStyles;

	private _showNotificationBar: boolean;

	constructor(
		private _zone: NgZone,
		private _hotelOperationsDashboardService: HotelOperationsDashboardService,
		private _hotelService: HotelService,
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

		this.updateFilterNotification();
	}

	ngOnInit() {
		this.hotelOperationsDashboard.registerRoomsCanvas(this);
		this._hotelService.getHotelDetailsDO().subscribe((details: HotelDetailsDO) => {
			this.currentDate = details.currentThTimestamp.thDateDO.buildPrototype();
			this._hotelOperationsDashboardService.getRoomItems().subscribe((r: any) => {
				this._utils.setRoomsUIHighlight(r, this.dragStyles.default);
				this.filterValue.currentValue = this.filterValue.newValue;
				this._showNotificationBar = true;
				this.filteredRoomVMList = this._utils.filterRoomsByStateType(this.filterValue.currentValue, r);
				this.updateFilterNotification();
			}, (error: any) => {
				this._appContext.toaster.error(error.message);
			});

		})
	}
	ngAfterViewInit(): void {
		$('.rooms-canvas-lower').droppable({
			tolerance: "touch",
			over: (event, ui) => {
				if (!this.scrollableRoomsCanvas || _.isNumber(this.lowerScrollInterval)) {
					return;
				}
				this.scrollableRoomsCanvas.scrollDown();
				this.lowerScrollInterval = window.setInterval(() => {
					this.scrollableRoomsCanvas.scrollDown();
				}, RoomsCanvasComponent.scrollTimeout);
			},
			out: (event, ui) => {
				clearInterval(this.lowerScrollInterval);
				this.lowerScrollInterval = null;
			}
		});
		$('.rooms-canvas-upper').droppable({
			tolerance: "touch",
			over: (event, ui) => {
				if (!this.scrollableRoomsCanvas || _.isNumber(this.upperScrollInterval)) {
					return;
				}
				this.scrollableRoomsCanvas.scrollUp();
				this.upperScrollInterval = window.setInterval(() => {
					this.scrollableRoomsCanvas.scrollUp();
				}, RoomsCanvasComponent.scrollTimeout);
			},
			out: (event, ui) => {
				clearInterval(this.upperScrollInterval);
				this.upperScrollInterval = null;
			}
		});
	}

	public refresh() {
		this._hotelOperationsDashboardService.refreshRooms();
	}

	public startedDragging(arrivalItemVM: ArrivalItemInfoVM) {
		var canCheckInRoomVmList: RoomItemInfoVM[] = [];
		var canNotCheckInRoomVmList: RoomItemInfoVM[] = [];
		var canUpgradeCheckInRoomVMList: RoomItemInfoVM[] = [];

		this.filteredRoomVMList.forEach(currentRoom => {
			if (currentRoom.canCheckIn(arrivalItemVM)) {
				canCheckInRoomVmList.push(currentRoom);
			}
			else if (currentRoom.canUpgrade(arrivalItemVM)) {
				canUpgradeCheckInRoomVMList.push(currentRoom);
			}
			else {
				canNotCheckInRoomVmList.push(currentRoom);
			}
		});

		this._utils.setRoomsUIHighlight(canCheckInRoomVmList, this.dragStyles.canCheckIn);
		this._utils.setRoomsUIHighlight(canNotCheckInRoomVmList, this.dragStyles.canNotCheckIn);
	}

	private testCanCheckIn(room: RoomItemInfoVM, arrivalItem: ArrivalItemInfoVM) {
		if (
			room.canFit(arrivalItem.bookingCapacity) &&
			room.roomVM.category.id == arrivalItem.reservedRoomCategoryStats.roomCategory.id &&
			room.isFree()
		) {
			return true;
		}
		return false;
	}

	private testCanUpgrade(room: RoomItemInfoVM, arrivalItem: ArrivalItemInfoVM) {
		if (
			room.canFit(arrivalItem.bookingCapacity) &&
			room.isFree()
		) {
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

	public getSelectedArrivalItem(): ArrivalItemInfoVM {
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
		var properties = this._utils.getfilterNotificationProperties(this.filterValue.currentValue, this._appContext.thTranslation);
		if (!this.filterNotification) {
			this.filterNotification = {
				Properties: properties
			}
		}
		else {
			this.filterNotification.Properties = properties;
		}
	}

	public stoppedDragging(arrivalItemVM) {
		this._utils.setRoomsUIHighlight(this.filteredRoomVMList, this.dragStyles.default);
	}

	public getDateShortString() {
		return this.currentDate.getShortDisplayString(this._appContext.thTranslation);
	}
}