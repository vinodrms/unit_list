import { Component, OnInit, AfterViewInit } from '@angular/core';

import {ThDateDO} from '../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe'

import {ColorFilterVM} from '../../../../../../../services/yield-manager/dashboard/filter/view-models/ColorFilterVM';
import {TextFilterVM} from '../../../../../../../services/yield-manager/dashboard/filter/view-models/TextFilterVM';
import {YieldManagerDashboardFilterService} from '../../../../../../../services/yield-manager/dashboard/filter/YieldManagerDashboardFilterService';

import {YieldColorFitlerItemComponent} from './components/yield-color-filter-item/YieldColorFilterItemComponent';
import {YieldTextFilterItemComponent} from './components/yield-text-filter-item/YieldTextFilterItemComponent';

import {IYieldManagerDashboardFilter} from '../../YieldManagerDashboardComponent'

import {FilterVMCollection} from '../../../../../../../services/yield-manager/dashboard/filter/utils/FilterVMCollection';

@Component({
	selector: 'yield-filter-pane',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/components/yield-filter-pane/template/yield-filter-pane.html',
	directives: [YieldColorFitlerItemComponent, YieldTextFilterItemComponent],
	pipes: [TranslationPipe]
})
export class YieldFilterPaneComponent implements OnInit {
	public selectedDate: ThDateDO;
	public searchText: string;

	public yieldColorFilterCollection: FilterVMCollection<ColorFilterVM>;
	public yieldTextFilterCollection: FilterVMCollection<TextFilterVM>;

	private _yieldManager: IYieldManagerDashboardFilter;

	constructor(
		private _appContext: AppContext,
		private _filterService: YieldManagerDashboardFilterService) {
		this.selectedDate = ThDateDO.buildThDateDO(2016, 11, 30);
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

	public nextDay() {
		this.selectedDate.addDays(1);
		this.refresh();
	}

	public previousDay() {
		this.selectedDate.addDays(-1);
		this.refresh();
	}

	public getDateShortString() {
		return this.selectedDate.getShortDisplayString(this._appContext.thTranslation);
	}

	public refresh() {
		//TODO: 
	}

	public searchTextChangeHandler(value) {
		this.searchText = value;
		alert(value);
	}
}