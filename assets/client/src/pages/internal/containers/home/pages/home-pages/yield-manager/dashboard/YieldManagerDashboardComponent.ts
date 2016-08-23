import {Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {LazyLoadingTableComponent} from '../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {HeaderPageService} from '../../../utils/header/container/services/HeaderPageService';
import {HeaderPageType} from '../../../utils/header/container/services/HeaderPageType';
import {AHomeContainerComponent} from '../../../utils/AHomeContainerComponent';

import {ThDateDO} from '../../../../../../services/common/data-objects/th-dates/ThDateDO';

import {YieldFilterPaneComponent} from './components/yield-filter-pane/YieldFilterPaneComponent';
import {YieldKeyMetricsComponent} from './components/yield-key-metrics/YieldKeyMetricsComponent';
import {YieldPriceProductsComponent} from './components/yield-price-products/YieldPriceProductsComponent';
import {YieldViewModeComponent} from './components/yield-view-mode/YieldViewModeComponent';
import {YieldViewModeState} from './components/yield-view-mode/YieldViewModeComponent';

import {YieldFiltersService} from '../../../../../../services/hotel-configurations/YieldFiltersService';
import {HotelService} from '../../../../../../services/hotel/HotelService';
import {HotelDetailsDO} from '../../../../../../services/hotel/data-objects/HotelDetailsDO';

import {YieldManagerDashboardFilterService} from '../../../../../../services/yield-manager/dashboard/filter/YieldManagerDashboardFilterService';
import {YieldManagerDashboardPriceProductsService} from '../../../../../../services/yield-manager/dashboard/price-products/YieldManagerDashboardPriceProductsService';
import {YieldManagerDashboardKeyMetricsService} from '../../../../../../services/yield-manager/dashboard/key-metrics/YieldManagerDashboardKeyMetricsService';

import {CustomScroll} from '../../../../../../../../common/utils/directives/CustomScroll';

import {IFilterSelection} from './common/interfaces/IFilterSelection';

import {AppContext} from '../../../../../../../../common/utils/AppContext';

export interface IYieldManagerDashboardFilter {
	updateYieldTimeFrameParams(currentDate: ThDateDO, noDays: number);
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
	providers: [YieldFiltersService, HotelService,
		YieldManagerDashboardFilterService, YieldManagerDashboardPriceProductsService, YieldManagerDashboardKeyMetricsService]
})
export class YieldManagerDashboardComponent extends AHomeContainerComponent implements OnInit, IYieldManagerDashboardFilter, IYieldManagerDashboardPriceProducts {
	public keyMetricsViewModeDecoratorClass =  ViewModeDecoratorClass.Default;
	public priceProductsViewModeDecoratorClass =  ViewModeDecoratorClass.Default;
	public currentDate: ThDateDO;

	@ViewChildren(CustomScroll) scrollBars: CustomScroll[];
	@ViewChild(YieldPriceProductsComponent) yieldPriceProductsComponent : YieldPriceProductsComponent;
	@ViewChild(YieldKeyMetricsComponent) yieldKeyMetricsComponent : YieldPriceProductsComponent;
	@ViewChild(YieldFilterPaneComponent) yieldFilterPaneComponent : YieldFilterPaneComponent;

	constructor(
		headerPageService: HeaderPageService,
		private _hotelService: HotelService,
		private _appContext: AppContext
	) {
		super(headerPageService, HeaderPageType.YieldManager);
		console.log("ctr YieldManagerDashboardComponent");
	}

	ngOnInit() {
		console.log("ngInit YieldManagerDashboardComponent");
		this.yieldFilterPaneComponent.yieldManager = this;
		this.yieldPriceProductsComponent.yieldManager = this;
		this.yieldKeyMetricsComponent.yieldManager = this;
	}

	public updateYieldTimeFrameParams(date: ThDateDO, noDays: number){
		this.yieldPriceProductsComponent.refreshTable(date, noDays);
		this.yieldKeyMetricsComponent.refreshTable(date, noDays);
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
		
		if (this.scrollBars){
			this.scrollBars.forEach((scrollBar) =>{
				scrollBar.forceRecreate();
			})
		}
	}

	public filterChangeHandler(selectedFilters:IFilterSelection){
		this.yieldPriceProductsComponent.applyFilters(selectedFilters);
	}
}