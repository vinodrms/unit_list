import {Component, OnInit, OnDestroy, Inject, provide} from '@angular/core';
import {RouteConfig, RouterOutlet, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {BaseComponent} from '../../../../../common/base/BaseComponent';
import {MainHeaderComponent} from '../pages/utils/header/container/MainHeaderComponent';
import {HeaderPageService} from '../pages/utils/header/container/services/HeaderPageService';
import {SETTINGS_PROVIDERS} from '../../../services/settings/SettingsProviders';
import {TaxService} from '../../../services/taxes/TaxService';
import {HOTEL_AGGREGATOR_PROVIDERS} from '../../../services/hotel/HotelProviders';
import {ISocketsService} from '../../../../../common/utils/sockets/ISocketsService';
import {SocketsService} from '../../../../../common/utils/sockets/SocketsService';

import {HotelOperationsDashboardComponent} from '../pages/home-pages/hotel-operations/container/HotelOperationsDashboardComponent';
import {YieldManagerContainerComponent} from '../pages/home-pages/yield-manager/container/YieldManagerContainerComponent';
import {BookingHistoryContainerComponent} from '../pages/home-pages/booking-history/container/BookingHistoryContainerComponent';
import {SettingsContainerComponent} from '../pages/home-pages/settings/container/SettingsContainerComponent';

@RouteConfig([
	{ path: '/operations', name: 'HotelOperationsDashboardComponent', component: HotelOperationsDashboardComponent, useAsDefault: true },
	{ path: '/yield-manager', name: 'YieldManagerContainerComponent', component: YieldManagerContainerComponent },
	{ path: '/bookings', name: 'BookingHistoryContainerComponent', component: BookingHistoryContainerComponent },
	{ path: '/settings/...', name: 'SettingsContainerComponent', component: SettingsContainerComponent }
])

@Component({
	selector: 'main-home-component',
	templateUrl: '/client/src/pages/internal/containers/home/main/template/main-home-component.html',
	providers: [HeaderPageService, provide(ISocketsService, { useClass: SocketsService }),
		SETTINGS_PROVIDERS, HOTEL_AGGREGATOR_PROVIDERS, TaxService],
	directives: [MainHeaderComponent, ROUTER_DIRECTIVES]
})

export class MainHomeComponent extends BaseComponent implements OnDestroy {

	constructor(@Inject(ISocketsService) private _sockets: ISocketsService) {
		super();

		this._sockets.init();
	}

	public ngOnDestroy() {
		this._sockets.release();
	}
}