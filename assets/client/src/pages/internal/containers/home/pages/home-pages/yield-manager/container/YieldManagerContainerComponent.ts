import {Component, OnInit} from '@angular/core';
import {HeaderPageService} from '../../../utils/header/services/HeaderPageService';
import {HeaderPageType} from '../../../utils/header/services/HeaderPageType';
import {AHomeContainerComponent} from '../../../utils/AHomeContainerComponent';

@Component({
	selector: 'yield-manager-container',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/container/template/yield-manager-container.html'
})

export class YieldManagerContainerComponent extends AHomeContainerComponent implements OnInit {

	constructor(headerPageService: HeaderPageService) {
		super(headerPageService, HeaderPageType.YieldManager);
	}

	ngOnInit() {
	}
}