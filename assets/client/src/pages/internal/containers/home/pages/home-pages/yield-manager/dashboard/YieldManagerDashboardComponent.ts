import {Component, OnInit} from '@angular/core';
import {LazyLoadingTableComponent} from '../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {HeaderPageService} from '../../../utils/header/container/services/HeaderPageService';
import {HeaderPageType} from '../../../utils/header/container/services/HeaderPageType';
import {AHomeContainerComponent} from '../../../utils/AHomeContainerComponent';

import {YieldFilterPaneComponent} from './components/yield-filter-pane/YieldFilterPaneComponent';
import {YieldKeyMetricsComponent} from './components/yield-key-metrics/YieldKeyMetricsComponent';
import {YieldPriceProductsComponent} from './components/yield-price-products/YieldPriceProductsComponent';


import {YieldFiltersService} from '../../../../../../services/hotel-configurations/YieldFiltersService';
import {YieldManagerDashboardFilterService} from '../../../../../../services/yield-manager/dashboard/filter/YieldManagerDashboardFilterService';
import {YieldManagerDashboardPriceProductsService} from '../../../../../../services/yield-manager/dashboard/price-products/YieldManagerDashboardPriceProductsService';
import {YieldManagerDashboardKeyMetricsService} from '../../../../../../services/yield-manager/dashboard/key-metrics/YieldManagerDashboardKeyMetricsService';

import {CustomScroll} from '../../../../../../../../common/utils/directives/CustomScroll';

export interface IYieldManagerDashboardFilter {

}

export interface IYieldManagerDashboardPriceProducts {

}

@Component({
	selector: 'yield-manager-dashboard',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/dashboard/template/yield-manager-dashboard.html',
	directives: [CustomScroll, LazyLoadingTableComponent, YieldFilterPaneComponent, YieldKeyMetricsComponent, YieldPriceProductsComponent],
	providers: [YieldFiltersService,
		YieldManagerDashboardFilterService, YieldManagerDashboardPriceProductsService, YieldManagerDashboardKeyMetricsService]
})
export class YieldManagerDashboardComponent extends AHomeContainerComponent implements OnInit, IYieldManagerDashboardFilter, IYieldManagerDashboardPriceProducts {

	constructor(headerPageService: HeaderPageService) {
		super(headerPageService, HeaderPageType.YieldManager);
	}

	ngOnInit() {
	}
}