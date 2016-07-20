import {Component, OnInit} from '@angular/core';
import {HeaderPageService} from '../../utils/header/container/services/HeaderPageService';
import {HeaderPageType} from '../../utils/header/container/services/HeaderPageType';
import {AHomeContainerComponent} from '../../utils/AHomeContainerComponent';

@Component({
	selector: 'yield-manager-container',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/template/yield-manager-container.html'
})

export class YieldManagerDashboardComponent extends AHomeContainerComponent implements OnInit {

	constructor(headerPageService: HeaderPageService) {
		super(headerPageService, HeaderPageType.YieldManager);
	}

	ngOnInit() {
	}
}