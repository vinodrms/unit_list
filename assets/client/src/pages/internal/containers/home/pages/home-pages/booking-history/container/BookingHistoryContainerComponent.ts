import {Component, OnInit} from '@angular/core';
import {HeaderPageService} from '../../../utils/header/container/services/HeaderPageService';
import {HeaderPageType} from '../../../utils/header/container/services/HeaderPageType';
import {AHomeContainerComponent} from '../../../utils/AHomeContainerComponent';

@Component({
	selector: 'booking-history-container',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/booking-history/container/template/booking-history-container.html'
})

export class BookingHistoryContainerComponent extends AHomeContainerComponent implements OnInit {

	constructor(headerPageService: HeaderPageService) {
		super(headerPageService, HeaderPageType.BookingHistory);
	}

	ngOnInit() {
	}
}