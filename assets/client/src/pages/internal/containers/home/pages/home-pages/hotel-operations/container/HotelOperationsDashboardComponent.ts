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

declare var $:any;

export interface IHotelOperationsDashboardArrivalsPaneMediator{
	registerArrivalsPane(arrivalsPane:ArrivalsPaneComponent);

	startedDragging(arrivalItemVM);
	getSelectedArrivalItem():any;
	clickedArrivalItem(arrivalItemVM);
}

export interface IHotelOperationsDashboardRoomsCanvasMediator{
	registerRoomsCanvas(arrivalsPane:RoomsCanvasComponent);

	getSelectedArrivalItem():any;
	checkInArrivalItem(arrivalItem)
}

export interface IHotelOperationsDashboardDeparturesMediator{
	registerDeparturesPane(departuresPane:DeparturesPaneComponent);
}

@Component({
	selector: 'hotel-operations-dashboard',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/container/template/hotel-operations-dashboard.html',
	directives: [ThButtonComponent, ArrivalsPaneComponent, DeparturesPaneComponent, RoomsCanvasComponent],
	pipes: [TranslationPipe]
})
export class HotelOperationsDashboardComponent extends AHomeContainerComponent implements OnInit, IHotelOperationsDashboardArrivalsPaneMediator, IHotelOperationsDashboardRoomsCanvasMediator, IHotelOperationsDashboardDeparturesMediator {
	public self: IHotelOperationsDashboardRoomsCanvasMediator;
	private roomVMList: any;
	private _arrivalsPane: ArrivalsPaneComponent;
	private _roomsCanvas: RoomsCanvasComponent;
	private _departuresPane: DeparturesPaneComponent;

	private _selectedArrivalItem = null;
	constructor(headerPageService: HeaderPageService
		) {
		super(headerPageService, HeaderPageType.HotelOperations);
		this.self = this;
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
	

	public clickedArrivalItem(arrivalItemVM){
		this._selectedArrivalItem = arrivalItemVM;
	}
	
	public getSelectedArrivalItem(){
		return this._selectedArrivalItem;
	}

	public checkInArrivalItem(arrivalItemVM){
		debugger;
		this._arrivalsPane.removeArrivalItem(arrivalItemVM);
	}

	ngOnInit() {

	}
}