import { Component, OnInit, AfterViewInit } from '@angular/core';

import {ThDateDO} from '../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe'

import {ColorFilterVM} from '../../../../../../../services/yield-manager/dashboard/filter/view-models/ColorFilterVM';
import {TextFilterVM} from '../../../../../../../services/yield-manager/dashboard/filter/view-models/TextFilterVM';
import {YieldManagerDashboardFilterService} from '../../../../../../../services/yield-manager/dashboard/filter/YieldManagerDashboardFilterService';

import {YieldGroupItemComponent} from './components/yield-group-item/YieldGroupItemComponent';
import {YieldLevelItemComponent} from './components/yield-level-item/YieldLevelItemComponent';

import {IYieldManagerDashboardFilter} from '../../YieldManagerDashboardComponent'

@Component({
	selector: 'yield-filter-pane',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/components/yield-filter-pane/template/yield-filter-pane.html',
	directives: [YieldGroupItemComponent, YieldLevelItemComponent],
	pipes: [TranslationPipe]
})
export class YieldFilterPaneComponent implements OnInit {
	public selectedDate: ThDateDO;
	public searchText: string;

	public yieldGroups: ColorFilterVM[];
	public yieldLevels: TextFilterVM[];

	private _yieldManager: IYieldManagerDashboardFilter;

	constructor(
		private _appContext: AppContext,
		private _filterService: YieldManagerDashboardFilterService) {
		this.selectedDate = ThDateDO.buildThDateDO(2016, 11, 30);
	}

	ngOnInit() {
		this._filterService.getColorFilterCollections().subscribe((groups) => {
			this.yieldGroups = groups[0].filterVMList;
		}, (e) => {
			console.log(e);
		})

		this._filterService.getTextFilterCollections().subscribe((levels) => {
			this.yieldLevels = levels[0].filterVMList;
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