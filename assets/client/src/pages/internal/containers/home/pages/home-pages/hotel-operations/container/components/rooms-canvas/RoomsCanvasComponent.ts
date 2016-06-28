import {Component, OnInit, NgZone} from '@angular/core';
import {RoomCardComponent} from './components/room-card/RoomCardComponent';

declare var $: any;

@Component({
	selector: 'rooms-canvas',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/container/components/rooms-canvas/template/rooms-canvas.html',
	directives: [RoomCardComponent]
})

export class RoomsCanvasComponent implements OnInit {
	public roomVMList: any[];
	constructor(private _zone: NgZone) {
	}

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

	public dropHandled(event){
		alert("Drop was handled");
	}
}