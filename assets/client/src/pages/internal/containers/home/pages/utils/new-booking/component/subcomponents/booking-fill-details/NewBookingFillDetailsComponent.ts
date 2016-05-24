import {Component, OnInit} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';

@Component({
	selector: 'new-booking-fill-details',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-fill-details/template/new-booking-fill-details.html'
})
export class NewBookingFillDetailsComponent extends BaseComponent implements OnInit {
	constructor() {
		super();
	}

	ngOnInit() { }
}