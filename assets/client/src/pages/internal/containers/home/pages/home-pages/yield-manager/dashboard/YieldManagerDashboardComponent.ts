import {Component, OnInit, ViewChildren} from '@angular/core';
import {LazyLoadingTableComponent} from '../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {HeaderPageService} from '../../../utils/header/container/services/HeaderPageService';
import {HeaderPageType} from '../../../utils/header/container/services/HeaderPageType';
import {AHomeContainerComponent} from '../../../utils/AHomeContainerComponent';

import {YieldFilterPaneComponent} from './components/yield-filter-pane/YieldFilterPaneComponent';
import {YieldKeyMetricsComponent} from './components/yield-key-metrics/YieldKeyMetricsComponent';
import {YieldPriceProductsComponent} from './components/yield-price-products/YieldPriceProductsComponent';
import {YieldViewModeComponent} from './components/yield-view-mode/YieldViewModeComponent';
import {YieldViewModeState} from './components/yield-view-mode/YieldViewModeComponent';

import {YieldFiltersService} from '../../../../../../services/hotel-configurations/YieldFiltersService';
import {YieldManagerDashboardFilterService} from '../../../../../../services/yield-manager/dashboard/filter/YieldManagerDashboardFilterService';
import {YieldManagerDashboardPriceProductsService} from '../../../../../../services/yield-manager/dashboard/price-products/YieldManagerDashboardPriceProductsService';
import {YieldManagerDashboardKeyMetricsService} from '../../../../../../services/yield-manager/dashboard/key-metrics/YieldManagerDashboardKeyMetricsService';

import {CustomScroll} from '../../../../../../../../common/utils/directives/CustomScroll';

export interface IYieldManagerDashboardFilter {

}

export interface IYieldManagerDashboardPriceProducts {

}

class ViewModeDecoratorClass{
	public static Default = '';
	public static Shrinked = 'shrinked';
	public static Expanded = 'expanded';
}

@Component({
	selector: 'yield-manager-dashboard',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/dashboard/template/yield-manager-dashboard.html',
	directives: [CustomScroll, LazyLoadingTableComponent, YieldFilterPaneComponent, YieldKeyMetricsComponent, YieldViewModeComponent, YieldPriceProductsComponent],
	providers: [YieldFiltersService,
		YieldManagerDashboardFilterService, YieldManagerDashboardPriceProductsService, YieldManagerDashboardKeyMetricsService]
})
export class YieldManagerDashboardComponent extends AHomeContainerComponent implements OnInit, IYieldManagerDashboardFilter, IYieldManagerDashboardPriceProducts {
	public keyMetricsViewModeDecoratorClass =  ViewModeDecoratorClass.Default;
	public priceProductsViewModeDecoratorClass =  ViewModeDecoratorClass.Default;

	@ViewChildren(CustomScroll) scrollBars: CustomScroll[];

	constructor(headerPageService: HeaderPageService) {
		super(headerPageService, HeaderPageType.YieldManager);
	}

	ngOnInit() {
	}

	public viewModeStateChanged(state:YieldViewModeState){
		switch(state){
			case YieldViewModeState.Default:{
				this.keyMetricsViewModeDecoratorClass = ViewModeDecoratorClass.Default;
				this.priceProductsViewModeDecoratorClass = ViewModeDecoratorClass.Default;
				break;
			}
			case YieldViewModeState.ExpandedYieldKeyMetrics:{
				this.keyMetricsViewModeDecoratorClass = ViewModeDecoratorClass.Expanded;
				this.priceProductsViewModeDecoratorClass = ViewModeDecoratorClass.Shrinked;
				break;
			}
			case YieldViewModeState.ExpandedYieldPriceProducts:{
				this.keyMetricsViewModeDecoratorClass = ViewModeDecoratorClass.Shrinked;
				this.priceProductsViewModeDecoratorClass = ViewModeDecoratorClass.Expanded;
				break;
			}
		}
		debugger;
		if (this.scrollBars){
			this.scrollBars.forEach((scrollBar) =>{
				scrollBar.forceRecreate();
			})
		}
	}
}