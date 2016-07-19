import {Component, Input, Output, NgZone, ElementRef, EventEmitter} from '@angular/core';


declare var $: any;
@Component({
	selector: 'departure-item',
	// D:\coding\UnitPal\assets\client\src\pages\internal\containers\home\pages\home-pages\hotel-operations\container\components\departures-pane\components\departure-item\template\departure-item.html
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/dashboard/components/departures-pane/components/departure-item/template/departure-item.html'
})

export class DepartureItemComponent {
	@Input() departureItemVM: any;

	constructor(private _zone: NgZone, private _root: ElementRef) {
	}

	ngAfterViewInit() {

	}
}