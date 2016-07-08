import {Component, OnInit, Input} from '@angular/core';

import {IHotelOperationsDashboardDeparturesMediator} from '../../HotelOperationsDashboardComponent';
import {DepartureItemComponent} from './components/departure-item/DepartureItemComponent';

import {HotelOperationsDashboardService} from '../../services/HotelOperationsDashboardService';
// import {HeaderPageService} from '../../../utils/header/container/services/HeaderPageService';

declare var $:any;
@Component({
	selector: 'departures-pane',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/container/components/departures-pane/template/departures-pane.html',
	directives: [DepartureItemComponent]
})

export class DeparturesPaneComponent implements OnInit {
	public departureItemsVMList;
	public selectedDepartureItem;
	
	@Input() hotelOperationsDashboard: IHotelOperationsDashboardDeparturesMediator;

	constructor(private _hotelOperationsDashboardService: HotelOperationsDashboardService){
	}

	ngOnInit() {
		this.hotelOperationsDashboard.registerDeparturesPane(this);
		this.hotelOperationsDashboard.refresh();
	}

	public refresh(){
		var date = this.hotelOperationsDashboard.getDate(); 
		this._hotelOperationsDashboardService.getDepartures(date).then((departures:any[]) =>{
			this.departureItemsVMList = departures;
		});
	}

	public isDepartureItemSelected(departureItemVM){
		return this.selectedDepartureItem == departureItemVM;
	}

	public selectDepartureItem(departureItemVM){
		debugger;
		this.selectedDepartureItem = departureItemVM;
	}
	

	ngAfterViewInit() {
	}
}