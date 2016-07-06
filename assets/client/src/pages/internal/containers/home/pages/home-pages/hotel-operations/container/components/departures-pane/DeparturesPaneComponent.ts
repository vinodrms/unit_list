import {Component, OnInit, Input} from '@angular/core';

import {IHotelOperationsDashboardArrivalsPaneMediator} from '../../HotelOperationsDashboardComponent';
import {DepartureItemComponent} from './components/departure-item/DepartureItemComponent';

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
	
	@Input() hotelOperationsDashboard: IHotelOperationsDashboardArrivalsPaneMediator;

	ngOnInit() {

		this.departureItemsVMList = [
			{
				ClientName: "Robert Paulsen",
				NumberOfPeople: 2,
				NumberOfNights: 7,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 20.02.16",
			},
			{
				ClientName: "John Snow",
				NumberOfPeople: 2,
				NumberOfNights: 5,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 18.02.16",
			},		
			{
				ClientName: "Erika Einstein",
				NumberOfPeople: 2,
				NumberOfNights: 6,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 19.02.16",
			},
			{
				ClientName: "Dragos Pricope",
				NumberOfPeople: 1,
				NumberOfNights: 3,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 16.02.16",
			}
		]		
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