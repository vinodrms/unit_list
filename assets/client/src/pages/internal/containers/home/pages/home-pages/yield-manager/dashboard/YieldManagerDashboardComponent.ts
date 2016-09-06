import {Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {LazyLoadingTableComponent} from '../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {HeaderPageService} from '../../../utils/header/container/services/HeaderPageService';
import {HeaderPageType} from '../../../utils/header/container/services/HeaderPageType';
import {AHomeContainerComponent} from '../../../utils/AHomeContainerComponent';

import {ThDateDO} from '../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {YieldViewModeState} from './components/yield-view-mode/YieldViewModeComponent';
import {HotelDetailsDO} from '../../../../../../services/hotel/data-objects/HotelDetailsDO';
import {IFilterSelection} from './common/interfaces/IFilterSelection';
import {AppContext} from '../../../../../../../../common/utils/AppContext';

import {YieldFilterPaneComponent} from './components/yield-filter-pane/YieldFilterPaneComponent';
import {YieldTimeFrameHeaderComponent} from './components/yield-timeframe-header/YieldTimeFrameHeaderComponent';
import {YieldKeyMetricsComponent} from './components/yield-key-metrics/YieldKeyMetricsComponent';
import {YieldPriceProductsComponent} from './components/yield-price-products/YieldPriceProductsComponent';

import {YieldFiltersService} from '../../../../../../services/hotel-configurations/YieldFiltersService';
import {HotelService} from '../../../../../../services/hotel/HotelService';
import {YieldManagerDashboardFilterService} from '../../../../../../services/yield-manager/dashboard/filter/YieldManagerDashboardFilterService';
import {YieldManagerDashboardPriceProductsService} from '../../../../../../services/yield-manager/dashboard/price-products/YieldManagerDashboardPriceProductsService';
import {YieldManagerDashboardKeyMetricsService} from '../../../../../../services/yield-manager/dashboard/key-metrics/YieldManagerDashboardKeyMetricsService';

export interface IYieldManagerDashboardFilter {
	updateYieldTimeFrameParams(currentDate: ThDateDO, noDays: number);
}

export interface IYieldManagerDashboardPriceProducts {
	refresh();
}

class ViewModeDecoratorClass {
	public static Default = '';
	public static Shrinked = 'shrinked';
	public static Expanded = 'expanded';
}

@Component({
	selector: 'yield-manager-dashboard',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/dashboard/template/yield-manager-dashboard.html',
	providers: [YieldFiltersService, HotelService,
        YieldManagerDashboardFilterService, YieldManagerDashboardPriceProductsService, YieldManagerDashboardKeyMetricsService]
})
export class YieldManagerDashboardComponent extends AHomeContainerComponent implements OnInit, IYieldManagerDashboardFilter, IYieldManagerDashboardPriceProducts {
	public keyMetricsViewModeDecoratorClass = ViewModeDecoratorClass.Default;
	public priceProductsViewModeDecoratorClass = ViewModeDecoratorClass.Default;
	public currentDate: ThDateDO;

	@ViewChild(YieldPriceProductsComponent) yieldPriceProductsComponent: YieldPriceProductsComponent;
	@ViewChild(YieldKeyMetricsComponent) yieldKeyMetricsComponent: YieldPriceProductsComponent;
	@ViewChild(YieldFilterPaneComponent) yieldFilterPaneComponent: YieldFilterPaneComponent;
	@ViewChild(YieldTimeFrameHeaderComponent) yieldTimeFrameHeaderComponent: YieldTimeFrameHeaderComponent;

	constructor(
		headerPageService: HeaderPageService,
		private _hotelService: HotelService,
		private _appContext: AppContext
	) {
		super(headerPageService, HeaderPageType.YieldManager);
	}

	ngOnInit() {
		this.yieldFilterPaneComponent.yieldManager = this;
		this.yieldPriceProductsComponent.yieldManager = this;
		this.yieldKeyMetricsComponent.yieldManager = this;
		this.yieldTimeFrameHeaderComponent.yieldManager = this;
	}

	public refresh() {
		var date = this.yieldTimeFrameHeaderComponent.selectedDate;
		var noDays = this.yieldTimeFrameHeaderComponent.selectedTimeFrame.noDays;
		this.updateYieldTimeFrameParams(date, noDays);
	}

	public updateYieldTimeFrameParams(date: ThDateDO, noDays: number) {
		this.yieldPriceProductsComponent.refreshTable(date, noDays);
		this.yieldKeyMetricsComponent.refreshTable(date, noDays);
	}

	public viewModeStateChanged(state: YieldViewModeState) {
		switch (state) {
			case YieldViewModeState.Default: {
				this.keyMetricsViewModeDecoratorClass = ViewModeDecoratorClass.Default;
				this.priceProductsViewModeDecoratorClass = ViewModeDecoratorClass.Default;
				break;
			}
			case YieldViewModeState.ExpandedYieldKeyMetrics: {
				this.keyMetricsViewModeDecoratorClass = ViewModeDecoratorClass.Expanded;
				this.priceProductsViewModeDecoratorClass = ViewModeDecoratorClass.Shrinked;
				break;
			}
			case YieldViewModeState.ExpandedYieldPriceProducts: {
				this.keyMetricsViewModeDecoratorClass = ViewModeDecoratorClass.Shrinked;
				this.priceProductsViewModeDecoratorClass = ViewModeDecoratorClass.Expanded;
				break;
			}
		}
	}

	public filterChangeHandler(selectedFilters: IFilterSelection) {
		this.yieldPriceProductsComponent.applyFilters(selectedFilters);
	}
}