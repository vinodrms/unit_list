import {Component, OnInit} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {ThButtonComponent} from '../../../../../../../../common/utils/components/ThButtonComponent';
import {HeaderPageService} from '../../../utils/header/container/services/HeaderPageService';
import {HeaderPageType} from '../../../utils/header/container/services/HeaderPageType';
import {AHomeContainerComponent} from '../../../utils/AHomeContainerComponent';

// Page components
import {ArrivalsPaneComponent} from './components/arrivals-pane/ArrivalsPaneComponent';
import {DeparturesPaneComponent} from './components/departures-pane/DeparturesPaneComponent';
import {RoomsCanvasComponent} from './components/rooms-canvas/RoomsCanvasComponent';

import {ArrivalItemInfoVM} from '../../../../../../services/hotel-operations/dashboard/arrivals/view-models/ArrivalItemInfoVM';

import {HotelOperationsDashboardServiceDeprecated} from './services/HotelOperationsDashboardService';
import {HOTEL_OPERATIONS_DASHBOARD_PROVIDERS} from '../../../../../../services/hotel-operations/dashboard/HotelOperationsDashboardProviders';
import {HotelOperationsRoomService} from '../../../../../../services/hotel-operations/room/HotelOperationsRoomService';

declare var $:any;

export interface IHotelOperationsDashboardArrivalsPaneMediator{
	registerArrivalsPane(arrivalsPane:ArrivalsPaneComponent);

	startedDragging(arrivalItemVM);
	stoppedDragging(arrivalItemVM);
	getSelectedArrivalItem():any;
	clickedArrivalItem(arrivalItemVM);
	getDate();
}

export interface IHotelOperationsDashboardRoomsCanvasMediator{
	registerRoomsCanvas(arrivalsPane:RoomsCanvasComponent);

	getSelectedArrivalItem():ArrivalItemInfoVM;
	checkInArrivalItem(arrivalItem)
	getDate();
	setDate(date);
	refresh();
}

export interface IHotelOperationsDashboardDeparturesMediator{
	registerDeparturesPane(departuresPane:DeparturesPaneComponent);
	getDate();
	refresh();
}


@Component({
	selector: 'hotel-operations-dashboard',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/dashboard/template/hotel-operations-dashboard.html',
	directives: [ThButtonComponent, ArrivalsPaneComponent, DeparturesPaneComponent, RoomsCanvasComponent],
	providers: [HOTEL_OPERATIONS_DASHBOARD_PROVIDERS, HotelOperationsRoomService, HotelOperationsDashboardServiceDeprecated],
	pipes: [TranslationPipe]
})

export class HotelOperationsDashboardComponent extends AHomeContainerComponent implements OnInit, IHotelOperationsDashboardArrivalsPaneMediator, IHotelOperationsDashboardRoomsCanvasMediator, IHotelOperationsDashboardDeparturesMediator {
	public self: IHotelOperationsDashboardRoomsCanvasMediator;
	private roomVMList: any;
	private _arrivalsPane: ArrivalsPaneComponent;
	private _roomsCanvas: RoomsCanvasComponent;
	private _departuresPane: DeparturesPaneComponent;

	private _currentDate;

	private _selectedArrivalItem = null;

	constructor(
		headerPageService: HeaderPageService
		) {
		super(headerPageService, HeaderPageType.HotelOperations);
		this.self = this;
		this._currentDate = 0;
	}

	public refresh(){
		this._arrivalsPane.refresh();
		this._roomsCanvas.refresh();
		this._departuresPane.refresh();
	}

	public registerArrivalsPane(arrivalsPane:ArrivalsPaneComponent){
		this._arrivalsPane = arrivalsPane;
	}

	public registerRoomsCanvas(roomsCanvas:RoomsCanvasComponent){
		this._roomsCanvas = roomsCanvas;
	}

	public registerDeparturesPane(departuresPane:DeparturesPaneComponent){
		this._departuresPane = departuresPane;
	}

	public startedDragging(arrivalItemVM){
		this._selectedArrivalItem = arrivalItemVM;
		this._roomsCanvas.startedDragging(arrivalItemVM);
	}

	public stoppedDragging(arrivalItemVM){
		this._roomsCanvas.stoppedDragging(arrivalItemVM);
	}
	
	public getDate(){
		return this._currentDate;
	}

	public setDate(date){
		this._currentDate = date;
	}

	public clickedArrivalItem(arrivalItemVM){
		this._selectedArrivalItem = arrivalItemVM;
	}
	
	public getSelectedArrivalItem():ArrivalItemInfoVM{
		return this._selectedArrivalItem;
	}

	public checkInArrivalItem(arrivalItemVM){
		// this._arrivalsPane.removeArrivalItem(arrivalItemVM);
		this.refresh();
	}

	ngOnInit() {

	}
}