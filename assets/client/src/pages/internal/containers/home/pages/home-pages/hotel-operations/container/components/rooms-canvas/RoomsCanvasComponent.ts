import {Component, Input, OnInit, NgZone} from '@angular/core';
import {RoomCardComponent} from './components/room-card/RoomCardComponent';

import {IHotelOperationsDashboardRoomsCanvasMediator} from '../../HotelOperationsDashboardComponent';

declare var $: any;

@Component({
	selector: 'rooms-canvas',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/container/components/rooms-canvas/template/rooms-canvas.html',
	directives: [RoomCardComponent]
})

export class RoomsCanvasComponent implements OnInit {
	@Input() hotelOperationsDashboard: IHotelOperationsDashboardRoomsCanvasMediator;

	public roomVMList: any[];
	constructor(private _zone: NgZone) {
	}

	ngOnInit() {
		this.hotelOperationsDashboard.registerRoomsCanvas(this);
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
			},
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
			},
			{
				Status: "Free",
				Type: "Double",
				Properties: {
					Name: "503",
					Booking: {
						ClientName: "Robert Paulsen",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "Free",
				Type: "Double",
				Properties: {
					Name: "504",
					Booking: {
						ClientName: "Paul Paulsen",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "Free",
				Type: "Double",
				Properties: {
					Name: "505",
					Booking: {
						ClientName: "Paul Paulsen",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "OutOfService",
				Type: "Double",
				Properties: {
					Name: "505",
					Booking: {
						ClientName: "Paul Paulsen",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "Reserved",
				Type: "Single",
				Properties: {
					Name: "505",
					Booking: {
						ClientName: "Paul Paulsen",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			}			
		]
	}

	public startedDragging(arrivalItemVM){
		console.log("started dragging");
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
}