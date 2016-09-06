import { Component, OnInit, AfterViewInit, ViewChildren, Input, Output, EventEmitter } from '@angular/core';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
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

@Component({
	selector: 'yield-filter-pane',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/dashboard/components/yield-filter-pane/template/yield-filter-pane.html'
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
		textFilter: IFilterVM
	}

	constructor(
		private _appContext: AppContext,
		private _filterService: YieldManagerDashboardFilterService) {
		this.selectedFilters = { colorFilter: null, textFilter: null };
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
	}

	public get yieldManager(): IYieldManagerDashboardFilter {
		return this._yieldManager;
	}

	public set yieldManager(v: IYieldManagerDashboardFilter) {
		this._yieldManager = v;
	}

	public searchTextChangeHandler(value) {
		this.searchText = value;
		this.notifyFilterChange();
	}

	public colorItemToggleSelection(event: { filterItemComponent: YieldColorFitlerItemComponent, selected: boolean }) {
		this.filtersDeselect<YieldColorFitlerItemComponent>(this.colorFilterComponents, event.filterItemComponent);
		this.notifyFilterChange();
	}

	public textItemToggleSelection(event: { filterItemComponent: YieldTextFilterItemComponent, selected: boolean }) {
		this.filtersDeselect<YieldTextFilterItemComponent>(this.textFilterComponents, event.filterItemComponent);
		this.notifyFilterChange();
	}

	private notifyFilterChange() {
		var selectedFilters = this.getSelectedFilters();
		this.filterChanged.emit(selectedFilters);
	}

	public getSelectedFilters(): IFilterSelection {
		var colorFilter = null;
		var textFilter = null;
		this.colorFilterComponents.forEach(filterComponent => {
			if (filterComponent.selected) {
				colorFilter = filterComponent.yieldColorFilterItemVM;
			}
		});
		this.textFilterComponents.forEach(filterComponent => {
			if (filterComponent.selected) {
				textFilter = filterComponent.yieldTextFilterItemVM;
			}
		});

		return {
			colorFilter: colorFilter,
			textFilter: textFilter,
			searchText: this.searchText
		}
	}

	private filtersDeselect<T extends AYieldFilterItemComponent>(filterComponents: T[], selectedItem: T) {
		var itemsToDeselect = filterComponents.filter((item: T) => {
			return item != selectedItem;
		});

		itemsToDeselect.forEach((item: T) => {
			item.deselect();
		});
	}
}