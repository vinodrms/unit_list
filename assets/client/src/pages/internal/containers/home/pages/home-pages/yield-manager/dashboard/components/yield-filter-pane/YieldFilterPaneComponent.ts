import { Component, OnInit, AfterViewInit, ViewChildren, Input, Output, EventEmitter } from '@angular/core';

// import {ThDateDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe'

import {ColorFilterVM} from '../../../../../../../../services/yield-manager/dashboard/filter/view-models/ColorFilterVM';
import {TextFilterVM} from '../../../../../../../../services/yield-manager/dashboard/filter/view-models/TextFilterVM';
import {YieldManagerDashboardFilterService} from '../../../../../../../../services/yield-manager/dashboard/filter/YieldManagerDashboardFilterService';

import {AYieldFilterItemComponent} from './components/common/AYieldFilterItemComponent';

import {YieldColorFitlerItemComponent} from './components/yield-color-filter-item/YieldColorFilterItemComponent';
import {YieldTextFilterItemComponent} from './components/yield-text-filter-item/YieldTextFilterItemComponent';

import {IYieldManagerDashboardFilter} from '../../YieldManagerDashboardComponent'
import {IFilterVM} from '../../../../../../../../services/yield-manager/dashboard/filter/view-models/IFilterVM';

import {FilterVMCollection} from '../../../../../../../../services/yield-manager/dashboard/filter/utils/FilterVMCollection';
import {CustomScroll} from '../../../../../../../../../../../src/common/utils/directives/CustomScroll';

import {IFilterSelection} from '../../common/interfaces/IFilterSelection';
// import {HotelService} from '../../../../../../../../services/hotel/HotelService';
// import {HotelDetailsDO} from '../../../../../../../../services/hotel/data-objects/HotelDetailsDO';

@Component({
	selector: 'yield-filter-pane',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/dashboard/components/yield-filter-pane/template/yield-filter-pane.html',
	directives: [CustomScroll, YieldColorFitlerItemComponent, YieldTextFilterItemComponent],
	pipes: [TranslationPipe]
})
export class YieldFilterPaneComponent implements OnInit {
	@ViewChildren(YieldColorFitlerItemComponent) colorFilterComponents: YieldColorFitlerItemComponent[];
	@ViewChildren(YieldTextFilterItemComponent) textFilterComponents: YieldTextFilterItemComponent[];
	@Output() filterChanged = new EventEmitter();

	// public selectedDate: ThDateDO;
	public searchText: string;

	public yieldColorFilterCollection: FilterVMCollection<ColorFilterVM>;
	public yieldTextFilterCollection: FilterVMCollection<TextFilterVM>;

	private _yieldManager: IYieldManagerDashboardFilter;

	private selectedFilters: {
		colorFilter: IFilterVM,
		textFilter :IFilterVM
	}

	constructor(
		// private _hotelService: HotelService,
		private _appContext: AppContext,
		private _filterService: YieldManagerDashboardFilterService) {
		// this.selectedDate = ThDateDO.buildThDateDO(2016, 11, 30);
		this.selectedFilters = {colorFilter : null, textFilter : null};

		// console.log("ctr YieldFilterPaneComponent");
	}

	ngOnInit() {
		this._filterService.getColorFilterCollections().subscribe((colorFilters) => {
			this.yieldColorFilterCollection = colorFilters[0];
		}, (e) => {
			console.log(e);
		})

		this._filterService.getTextFilterCollections().subscribe((textFilters) => {
			this.yieldTextFilterCollection = textFilters[0];
		}, (e) => {
			console.log(e);
		})

		// this._hotelService.getHotelDetailsDO().subscribe((details: HotelDetailsDO) => {
		// 	this.selectedDate = details.currentThTimestamp.thDateDO.buildPrototype();
		// 	this._yieldManager.updateYieldTimeFrameParams(this.selectedDate, 21);
		// 	}, (error:any) => {
		// 		this._appContext.toaster.error(error.message);
		// 	});
	}

	public get yieldManager(): IYieldManagerDashboardFilter {
		return this._yieldManager;
	}

	public set yieldManager(v: IYieldManagerDashboardFilter) {
		this._yieldManager = v;
	}

	// public nextDay() {
	// 	this.selectedDate.addDays(1);
	// 	this.refresh();
	// }

	// public previousDay() {
	// 	this.selectedDate.addDays(-1);
	// 	this.refresh();
	// }

	// public getDateShortString() {
	// 	return this.selectedDate.getShortDisplayString(this._appContext.thTranslation);
	// }

	// public setDate(date: ThDateDO){
	// 	this.selectedDate = date;
	// }

	// public refresh() {
	// 	this._yieldManager.updateYieldTimeFrameParams(this.selectedDate, 21);
	// }

	public searchTextChangeHandler(value) {
		this.searchText = value;
		this.notifyFilterChange();
	}

	public colorItemToggleSelection(event : {filterItemComponent: YieldColorFitlerItemComponent, selected: boolean}){
		this.filtersDeselect<YieldColorFitlerItemComponent>(this.colorFilterComponents, event.filterItemComponent);
		this.notifyFilterChange();
	}

	public textItemToggleSelection(event : {filterItemComponent: YieldTextFilterItemComponent, selected: boolean}){
		this.filtersDeselect<YieldTextFilterItemComponent>(this.textFilterComponents, event.filterItemComponent);
		this.notifyFilterChange();
	}

	private notifyFilterChange(){
		var selectedFilters = this.getSelectedFilters();
		this.filterChanged.emit(selectedFilters);
	}

	public getSelectedFilters(): IFilterSelection{
		var colorFilter = null;
		var textFilter = null;
		this.colorFilterComponents.forEach(filterComponent => {
			if (filterComponent.selected){
				colorFilter = filterComponent.yieldColorFilterItemVM;
			}
		});
		this.textFilterComponents.forEach(filterComponent => {
			if (filterComponent.selected){
				textFilter = filterComponent.yieldTextFilterItemVM;
			}
		});

		return {
			colorFilter : colorFilter,
			textFilter: textFilter,
			searchText: this.searchText
		}
	}

	private filtersDeselect<T extends AYieldFilterItemComponent>(filterComponents: T[], selectedItem: T){
		var itemsToDeselect = filterComponents.filter((item: T) => {
			return item != selectedItem;
		});

		itemsToDeselect.forEach( (item:T) => {
			item.deselect();
		});
	}
}