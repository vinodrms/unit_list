import {Component, OnInit} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {ThButtonComponent} from '../../../../../../../../common/utils/components/ThButtonComponent';
import {HeaderPageService} from '../../../utils/header/container/services/HeaderPageService';
import {HeaderPageType} from '../../../utils/header/container/services/HeaderPageType';
import {AHomeContainerComponent} from '../../../utils/AHomeContainerComponent';

// Page components
import {ArrivalsPaneComponent} from './components/arrivals-pane/ArrivalsPaneComponent';
import {DeparturesPaneComponent} from './components/departures-pane/DeparturesPaneComponent';
import {RoomsCanvasComponent} from './components/rooms-canvas/RoomsCanvasComponent';

declare var $:any;


@Component({
	selector: 'hotel-operations-dashboard',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/container/template/hotel-operations-dashboard.html',

	directives: [ThButtonComponent, ArrivalsPaneComponent, DeparturesPaneComponent, RoomsCanvasComponent],
	pipes: [TranslationPipe]
})
export class HotelOperationsDashboardComponent extends AHomeContainerComponent implements OnInit {
	private roomVMList: any;
	constructor(headerPageService: HeaderPageService
		) {
		super(headerPageService, HeaderPageType.HotelOperations);
	}

	ngOnInit() {

	}
}