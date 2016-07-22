import {Component, Input, Output, NgZone, ElementRef, EventEmitter} from '@angular/core';

import {HotelDashboardModalService} from '../../../../services/HotelDashboardModalService';
import {DepartureItemInfoVM} from '../../../../../../../../../../services/hotel-operations/dashboard/departures/view-models/DepartureItemInfoVM'

declare var $: any;
@Component({
	selector: 'departure-item',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/dashboard/components/departures-pane/components/departure-item/template/departure-item.html'
})

export class DepartureItemComponent {
	@Input() departureItemVM: DepartureItemInfoVM;

	constructor(private _zone: NgZone,
	private _root: ElementRef,
	private _modalService: HotelDashboardModalService
	) {
	}

	ngAfterViewInit() {
	}

	public openCustomerModal(){
		var customerId = this.departureItemVM.departureItemDO.customerId;
		this._modalService.openCustomerModal(customerId);
	}

	public openRoomModal(){
		var roomId = this.departureItemVM.departureItemDO.roomId;
		this._modalService.openRoomModal(roomId);
	}	
}