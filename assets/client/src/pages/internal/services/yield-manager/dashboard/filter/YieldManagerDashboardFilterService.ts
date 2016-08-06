import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {ColorFilterVM} from './view-models/ColorFilterVM';
import {TextFilterVM} from './view-models/TextFilterVM';
import {YieldFiltersService} from '../../../hotel-configurations/YieldFiltersService';
import {YieldFiltersDO} from '../../../hotel-configurations/data-objects/YieldFiltersDO';
import {YieldFilterDO, YieldFilterType} from '../../../common/data-objects/yield-filter/YieldFilterDO';
import {YieldFilterValueDO} from '../../../common/data-objects/yield-filter/YieldFilterValueDO';
import {FilterConverter} from './utils/FilterConverter';
import {FilterVMCollection} from './utils/FilterVMCollection';

@Injectable()
export class YieldManagerDashboardFilterService {
	private _filterConverter: FilterConverter;

	constructor(private _yieldFiltersService: YieldFiltersService) {
		this._filterConverter = new FilterConverter();
	}

	public getTextFilterCollections(): Observable<FilterVMCollection<TextFilterVM>[]> {
		return this.getFilterCollections<TextFilterVM>(YieldFilterType.Text, this._filterConverter.convertToTextFilter.bind(this._filterConverter));
	}

	public getColorFilterCollections(): Observable<FilterVMCollection<ColorFilterVM>[]> {
		return this.getFilterCollections<ColorFilterVM>(YieldFilterType.Color, this._filterConverter.convertToColorFilter.bind(this._filterConverter));
	}

	private getFilterCollections<T>(filterType: YieldFilterType, conversionStrategy: { (yieldFilterDO: YieldFilterDO, yieldValue: YieldFilterValueDO): T }): Observable<FilterVMCollection<T>[]> {
		return this.getYieldFilterList(filterType).map((yieldFilterList: YieldFilterDO[]) => {
			var filterCollectionList: FilterVMCollection<T>[] = [];

			_.forEach(yieldFilterList, (yieldFilter: YieldFilterDO) => {
				var filterVMCollection: FilterVMCollection<T> = new FilterVMCollection<T>();
				var filterVMList: T[] = [];
				_.forEach(yieldFilter.values, (yieldValue: YieldFilterValueDO) => {
					var filterVM: T = conversionStrategy(yieldFilter, yieldValue);
					filterVMList.push(filterVM);
				});
				filterVMCollection.filterVMList = filterVMList;
				filterCollectionList.push(filterVMCollection);
			});
			return filterCollectionList;
		});
	}
	private getYieldFilterList(filterType: YieldFilterType): Observable<YieldFilterDO[]> {
		return Observable.combineLatest(
            this._yieldFiltersService.getYieldFiltersDO()
        ).map((result: [YieldFiltersDO]) => {
            var yieldFilters: YieldFiltersDO = result[0];
			var foundYieldFilter: YieldFilterDO[] = _.filter(yieldFilters.yieldFilterList, (yieldFilter: YieldFilterDO) => {
				return yieldFilter.type === filterType;
			});
			return foundYieldFilter;
        });
	}
}