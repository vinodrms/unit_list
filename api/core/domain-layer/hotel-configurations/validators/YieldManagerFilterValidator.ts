import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';
import {PriceProductYieldFilterMetaDO} from '../../../data-layer/price-products/data-objects/yield-filter/PriceProductYieldFilterDO';
import {YieldFilterConfigurationDO} from '../../../data-layer/hotel-configurations/data-objects/yield-filter/YieldFilterConfigurationDO';
import {YieldFilterDO} from '../../../data-layer/common/data-objects/yield-filter/YieldFilterDO';
import {YieldFilterValueDO} from '../../../data-layer/common/data-objects/yield-filter/YieldFilterValueDO';

import _ = require("underscore");

export class YieldManagerFilterValidator {
	private _thUtils: ThUtils;

	private _filterListToCheck: PriceProductYieldFilterMetaDO[];
	private _filterListChecked: PriceProductYieldFilterMetaDO[];

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public validateFilter(filter: PriceProductYieldFilterMetaDO): Promise<boolean> {
		return this.validateFilterList([filter]);
	}

	public validateFilterList(filterList: PriceProductYieldFilterMetaDO[]): Promise<boolean> {
		this._filterListToCheck = filterList;
		return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
			this.validateFilterListCore(resolve, reject);
		});
	}

	private validateFilterListCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		if (this._filterListToCheck.length == 0) {
			resolve(true);
			return;
		}

		var hotelConfigRepo = this._appContext.getRepositoryFactory().getYieldFilterConfigurationsRepository();
		hotelConfigRepo.getYieldFilterConfiguration({ hotelId: this._sessionContext.sessionDO.hotel.id })
			.then((filterConfig: YieldFilterConfigurationDO) => {
				this._filterListChecked = this.getCheckedFilters(filterConfig.value);

				if (this._filterListToCheck.length != this._filterListChecked.length) {
					var thError = new ThError(ThStatusCode.YieldFilterValidatorInvalidFilters, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid PP filters", this._filterListToCheck, thError);
					throw thError;
				}
				resolve(true);
			}).catch((error: any) => {
				reject(error);
			});
	}
	private getCheckedFilters(availableFilterList: YieldFilterDO[]): PriceProductYieldFilterMetaDO[] {
		var checkedFilterList: PriceProductYieldFilterMetaDO[] = [];
		this._filterListToCheck.forEach((yieldFilter: PriceProductYieldFilterMetaDO) => {
			if (this.yieldFilterIsValid(availableFilterList, yieldFilter)) {
				checkedFilterList.push(yieldFilter);
			}
		});
		return checkedFilterList;
	}
	private yieldFilterIsValid(availableFilterList: YieldFilterDO[], yieldFilter: PriceProductYieldFilterMetaDO): boolean {
		var foundFilter: YieldFilterDO = _.find(availableFilterList, (filter: YieldFilterDO) => { return filter.id === yieldFilter.filterId });
		if (this._thUtils.isUndefinedOrNull(foundFilter)) {
			return false;
		}
		var ymFilterValueList: YieldFilterValueDO[] = foundFilter.values;
		var foundFilterValue: YieldFilterValueDO = _.find(ymFilterValueList, (filterValue: YieldFilterValueDO) => { return filterValue.id === yieldFilter.valueId });
		if (this._thUtils.isUndefinedOrNull(foundFilterValue)) {
			return false;
		}
		return true;
	}

	public getValidFilterList(): PriceProductYieldFilterMetaDO[] {
		return this._filterListChecked;
	}
}