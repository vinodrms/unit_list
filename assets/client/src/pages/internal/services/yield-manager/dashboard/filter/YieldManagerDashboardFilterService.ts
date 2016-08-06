import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {YieldGroupItemVM} from './view-models/YieldGroupItemVM';
import {YieldLevelItemVM} from './view-models/YieldLevelItemVM';

import {YieldFiltersService} from '../../../hotel-configurations/YieldFiltersService';
import {YieldFiltersDO} from '../../../hotel-configurations/data-objects/YieldFiltersDO';
import {YieldFilterDO, YieldFilterType} from '../../../common/data-objects/yield-filter/YieldFilterDO';
import {YieldFilterValueDO} from '../../../common/data-objects/yield-filter/YieldFilterValueDO';
import {ColorFilter, ColorMeta} from '../../../common/data-objects/yield-filter/ColorFilter';



@Injectable()
export class YieldManagerDashboardFilterService {

	constructor(private _yieldFiltersService: YieldFiltersService) { }

	public getYieldGroups(): Observable<YieldGroupItemVM[]> {
		return this.getYieldFilterDO(YieldFilterType.Color).map((yieldFilterDO: YieldFilterDO) => {
			var ygItemVMList: YieldGroupItemVM[] = [];
			var colorFilter = new ColorFilter();
			_.forEach(yieldFilterDO.values, (yieldValue: YieldFilterValueDO) => {
				var colorMeta: ColorMeta = colorFilter.getColorMetaByColorCode(yieldValue.colorCode);

				var ygItemVM = new YieldGroupItemVM({
					filterId: yieldFilterDO.id,
					valueId: yieldValue.id,
					colorName: colorMeta.displayName,
					cssClass: colorMeta.cssClass,
					description: yieldValue.description,
					filterName: yieldFilterDO.label
				});
				ygItemVMList.push(ygItemVM);
			});
			return ygItemVMList;
		});
	}


	public getYieldLevels(): Observable<YieldLevelItemVM[]> {
		return this.getYieldFilterDO(YieldFilterType.Text).map((yieldFilterDO: YieldFilterDO) => {
			var ygItemVMList: YieldLevelItemVM[] = [];

			_.forEach(yieldFilterDO.values, (yieldValue: YieldFilterValueDO) => {
				var ygItemVM = new YieldLevelItemVM({
					filterId: yieldFilterDO.id,
					valueId: yieldValue.id,
					displayName: yieldValue.label,
					description: yieldValue.description,
					filterName: yieldFilterDO.label
				});
				ygItemVMList.push(ygItemVM);
			});
			return ygItemVMList;
		});
	}

	private getYieldFilterDO(filterType: YieldFilterType): Observable<YieldFilterDO> {
		return Observable.combineLatest(
            this._yieldFiltersService.getYieldFiltersDO()
        ).map((result: [YieldFiltersDO]) => {
            var yieldFilters: YieldFiltersDO = result[0];
			var foundYieldFilter: YieldFilterDO = _.find(yieldFilters.yieldFilterList, (yieldFilter: YieldFilterDO) => {
				return yieldFilter.type === filterType;
			});
			return foundYieldFilter;
        });
	}
}