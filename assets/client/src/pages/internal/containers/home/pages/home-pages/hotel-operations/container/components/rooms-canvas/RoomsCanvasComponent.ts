import {Component, OnInit} from '@angular/core';

// import {HeaderPageService} from '../../../utils/header/container/services/HeaderPageService';

declare var $: any;
@Component({
	selector: 'rooms-canvas',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/container/components/rooms-canvas/template/rooms-canvas.html'
})

export class RoomsCanvasComponent implements OnInit {
	public roomVMList: any[];
	// constructor(headerPageService: HeaderPageService) {
	// }

	ngOnInit() {
		this.roomVMList = [
			{
				Status: "Occupied",
				Type: "Double",
				Properties: {
					Name: "501",
					Booking: {
						ClientName: "Robert Paulsen",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16",
					}
				}
			}
			,
			{
				Status: "Occupied",
				Type: "Double",
				Properties: {
					Name: "502",
					Booking: {
						ClientName: "Robert Paulsen",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			}
		]
	}

	ngAfterViewInit() {
	}
}