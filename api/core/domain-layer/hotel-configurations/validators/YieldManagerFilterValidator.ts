import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';
import {PriceProductYieldFilterDO} from '../../../data-layer/price-products/data-objects/yield-filter/PriceProductYieldFilterDO';
import {YieldManagerFilterConfigurationDO} from '../../../data-layer/hotel-configurations/data-objects/yield-manager-filter/YieldManagerFilterConfigurationDO';
import {YieldManagerFilterDO} from '../../../data-layer/common/data-objects/yield-manager-filter/YieldManagerFilterDO';
import {YieldManagerFilterValueDO} from '../../../data-layer/common/data-objects/yield-manager-filter/YieldManagerFilterValueDO';

import _ = require("underscore");

export class YieldManagerFilterValidator {
	private _thUtils: ThUtils;

	private _filterListToCheck: PriceProductYieldFilterDO[];
	private _filterListChecked: PriceProductYieldFilterDO[];

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public validateFilter(filter: PriceProductYieldFilterDO): Promise<boolean> {
		return this.validateFilterList([filter]);
	}

	public validateFilterList(filterList: PriceProductYieldFilterDO[]): Promise<boolean> {
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

		var hotelConfigRepo = this._appContext.getRepositoryFactory().getHotelConfigurationsRepository();
		hotelConfigRepo.getYieldManagerFilterConfiguration({ hotelId: this._sessionContext.sessionDO.hotel.id })
			.then((filterConfig: YieldManagerFilterConfigurationDO) => {
				this._filterListChecked = this.getCheckedFilters(filterConfig.value);

				if (this._filterListToCheck.length != this._filterListChecked.length) {
					var thError = new ThError(ThStatusCode.YieldManagerFilterValidatorInvalidFilters, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid PP filters", this._filterListToCheck, thError);
					throw thError;
				}
				resolve(true);
			}).catch((error: any) => {
				reject(error);
			});
	}
	private getCheckedFilters(availableFilterList: YieldManagerFilterDO[]): PriceProductYieldFilterDO[] {
		var checkedFilterList: PriceProductYieldFilterDO[] = [];
		this._filterListToCheck.forEach((yieldFilter: PriceProductYieldFilterDO) => {
			if (this.yieldFilterIsValid(availableFilterList, yieldFilter)) {
				checkedFilterList.push(yieldFilter);
			}
		});
		return checkedFilterList;
	}
	private yieldFilterIsValid(availableFilterList: YieldManagerFilterDO[], yieldFilter: PriceProductYieldFilterDO): boolean {
		var foundFilter: YieldManagerFilterDO = _.find(availableFilterList, (filter: YieldManagerFilterDO) => { return filter.id === yieldFilter.filterId });
		if (this._thUtils.isUndefinedOrNull(foundFilter)) {
			return false;
		}
		var ymFilterValueList: YieldManagerFilterValueDO[] = foundFilter.values;
		var foundFilterValue: YieldManagerFilterValueDO = _.find(ymFilterValueList, (filterValue: YieldManagerFilterValueDO) => { return filterValue.id === yieldFilter.valueId });
		if (this._thUtils.isUndefinedOrNull(foundFilterValue)) {
			return false;
		}
		return true;
	}

	public getValidFilterList(): PriceProductYieldFilterDO[] {
		return this._filterListChecked;
	}
}