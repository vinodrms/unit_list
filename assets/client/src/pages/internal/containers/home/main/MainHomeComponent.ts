import {Component, OnInit, OnDestroy, Inject, provide} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {BaseComponent} from '../../../../../common/base/BaseComponent';
import {MainHeaderComponent} from '../pages/utils/header/container/MainHeaderComponent';
import {HeaderPageService} from '../pages/utils/header/container/services/HeaderPageService';
import {SETTINGS_PROVIDERS} from '../../../services/settings/SettingsProviders';
import {TaxService} from '../../../services/taxes/TaxService';
import {HOTEL_AGGREGATOR_PROVIDERS} from '../../../services/hotel/HotelProviders';
import {RoomCategoriesService} from '../../../services/room-categories/RoomCategoriesService';
import {RoomCategoriesStatsService} from '../../../services/room-categories/RoomCategoriesStatsService';
import {ISocketsService} from '../../../../../common/utils/sockets/ISocketsService';
import {SocketsService} from '../../../../../common/utils/sockets/SocketsService';

import {HotelOperationsDashboardComponent} from '../pages/home-pages/hotel-operations/dashboard/HotelOperationsDashboardComponent';
import {YieldManagerDashboardComponent} from '../pages/home-pages/yield-manager/dashboard/YieldManagerDashboardComponent';
import {BookingHistoryDashboardComponent} from '../pages/home-pages/booking-history/BookingHistoryDashboardComponent';
import {SettingsContainerComponent} from '../pages/home-pages/settings/container/SettingsContainerComponent';

@Component({
	selector: 'main-home-component',
	templateUrl: '/client/src/pages/internal/containers/home/main/template/main-home-component.html',
	providers: [HeaderPageService, provide(ISocketsService, { useClass: SocketsService }),
		SETTINGS_PROVIDERS, HOTEL_AGGREGATOR_PROVIDERS, TaxService, RoomCategoriesService,
		RoomCategoriesStatsService],
	directives: [MainHeaderComponent, ROUTER_DIRECTIVES],
	precompile: [HotelOperationsDashboardComponent, YieldManagerDashboardComponent,
		BookingHistoryDashboardComponent, SettingsContainerComponent]
})

export class MainHomeComponent extends BaseComponent implements OnDestroy {

	constructor( @Inject(ISocketsService) private _sockets: ISocketsService) {
		super();

		this._sockets.init();
	}

	public ngOnDestroy() {
		this._sockets.release();
	}
}