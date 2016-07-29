import {Component, OnInit, Input} from '@angular/core';

import {IHotelOperationsDashboardDeparturesMediator} from '../../HotelOperationsDashboardComponent';
import {DepartureItemComponent} from './components/departure-item/DepartureItemComponent';

import {DepartureItemInfoVM} from '../../../../../../../../services/hotel-operations/dashboard/departures/view-models/DepartureItemInfoVM';

import {HotelOperationsDashboardService} from '../../../../../../../../services/hotel-operations/dashboard/HotelOperationsDashboardService';
import {HotelService} from '../../../../../../../../services/hotel/HotelService';

import {HotelDetailsDO} from '../../../../../../../../services/hotel/data-objects/HotelDetailsDO';

import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {ThError} from '../../../../../../../../../../common/utils/responses/ThError';

import {ThDateDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateDO';

import {CustomScroll} from '../../../../../../../../../../../src/common/utils/directives/CustomScroll';

declare var $:any;
@Component({
	selector: 'departures-pane',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/dashboard/components/departures-pane/template/departures-pane.html',
	directives: [CustomScroll, DepartureItemComponent]
})

export class DeparturesPaneComponent implements OnInit {
	public departureItemsVMList: DepartureItemInfoVM[];
	public filteredDeparturesVMList: DepartureItemInfoVM[];
	public selectedDepartureItem: DepartureItemInfoVM;
	public selectedDate: ThDateDO;
	public searchText: string = "";

	@Input() hotelOperationsDashboard: IHotelOperationsDashboardDeparturesMediator;

	constructor(
		private _hotelOperationsDashboardService: HotelOperationsDashboardService,
		private _hotelService:HotelService,
		private _appContext: AppContext){
	}

	ngOnInit() {
		this.hotelOperationsDashboard.registerDeparturesPane(this);
		this._hotelService.getHotelDetailsDO().subscribe((details: HotelDetailsDO)=>{
			this.selectedDate = details.currentThTimestamp.thDateDO.buildPrototype();
			//TODO: Remove
			this.selectedDate = ThDateDO.buildThDateDO(2016, 6, 23);
			
			this._hotelOperationsDashboardService.getDepartureItems(this.selectedDate)
				.subscribe((departures: DepartureItemInfoVM[]) => {
					this.departureItemsVMList = departures;
					this.updateFilterDepartures();
				}, (error: ThError) => {
					this._appContext.toaster.error(error.message);
				});
		
		});
	}

	private updateFilterDepartures(){
		if (this.searchText == ""){
			this.filteredDeparturesVMList = this.departureItemsVMList;
		}
		else {
			this.filteredDeparturesVMList = _.filter(this.departureItemsVMList, (item: DepartureItemInfoVM) => {
				return (item.customerName.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1);
			});
		}
	}
	
	public searchTextChangeHandler(value){
		this.searchText = value;
		this.updateFilterDepartures();
	}
	
	public nextDay() {
		this.selectedDate.addDays(1);
		this.refresh();
	}

	public previousDay() {
		this.selectedDate.addDays(-1);
		this.refresh();
	}

	public refresh(){
		//TODO: FIX THIS
		if (!this.selectedDate) {
			this.selectedDate = ThDateDO.buildThDateDO(2016, 6, 23);
		}

		this._hotelOperationsDashboardService.refreshDepartures(this.selectedDate);
	}

	public isDepartureItemSelected(departureItemVM:DepartureItemInfoVM){
		return this.selectedDepartureItem == departureItemVM;
	}

	public selectDepartureItem(departureItemVM){
		this.selectedDepartureItem = departureItemVM;
	}

	public getDateShortString() {
		return this.selectedDate.getShortDisplayString(this._appContext.thTranslation);
	}

	ngAfterViewInit() {
	}
}