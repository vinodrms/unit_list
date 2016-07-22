import {Component, OnInit, Input} from '@angular/core';

import {IHotelOperationsDashboardDeparturesMediator} from '../../HotelOperationsDashboardComponent';
import {DepartureItemComponent} from './components/departure-item/DepartureItemComponent';

import {DepartureItemInfoVM} from '../../../../../../../../services/hotel-operations/dashboard/departures/view-models/DepartureItemInfoVM';

import {HotelOperationsDashboardService} from '../../../../../../../../services/hotel-operations/dashboard/HotelOperationsDashboardService';

import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {ThError} from '../../../../../../../../../../common/utils/responses/ThError';

declare var $:any;
@Component({
	selector: 'departures-pane',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/dashboard/components/departures-pane/template/departures-pane.html',
	directives: [DepartureItemComponent]
})

export class DeparturesPaneComponent implements OnInit {
	public departureItemsVMList: DepartureItemInfoVM[];
	public selectedDepartureItem: DepartureItemInfoVM;
	
	@Input() hotelOperationsDashboard: IHotelOperationsDashboardDeparturesMediator;

	constructor(
		private _hotelOperationsDashboardService: HotelOperationsDashboardService,
		private _appContext: AppContext){
	}

	ngOnInit() {
		this.hotelOperationsDashboard.registerDeparturesPane(this);
		this.hotelOperationsDashboard.refresh();
	}

	public refresh(){
		var date = this.hotelOperationsDashboard.getDate(); 

		this._hotelOperationsDashboardService.getDepartureItems()
		.subscribe((departures: DepartureItemInfoVM[]) => {
			this.departureItemsVMList = departures;
			}, (error: ThError) => {
				this._appContext.toaster.error(error.message);
			});		
	}

	public isDepartureItemSelected(departureItemVM:DepartureItemInfoVM){
		return this.selectedDepartureItem == departureItemVM;
	}

	public selectDepartureItem(departureItemVM){
		this.selectedDepartureItem = departureItemVM;
	}
	

	ngAfterViewInit() {
	}
}