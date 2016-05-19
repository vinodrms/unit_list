import {Component, OnInit} from '@angular/core';
import {HeaderPageService} from '../../../utils/header/services/HeaderPageService';
import {HeaderPageType} from '../../../utils/header/services/HeaderPageType';
import {AHomeContainerComponent} from '../../../utils/AHomeContainerComponent';

@Component({
	selector: 'hotel-operations-container',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/container/template/hotel-operations-container.html'
})

export class HotelOperationsContainerComponent extends AHomeContainerComponent implements OnInit {

	constructor(headerPageService: HeaderPageService) {
		super(headerPageService, HeaderPageType.HotelOperations);
	}

	ngOnInit() {
	}
}