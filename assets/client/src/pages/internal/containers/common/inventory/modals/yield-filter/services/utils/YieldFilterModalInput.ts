import {YieldFilterDO} from '../../../../../../../services/common/data-objects/yield-filter/YieldFilterDO';
import {YieldFiltersService} from '../../../../../../../services/hotel-configurations/YieldFiltersService';

export class YieldFilterModalInput {
	private _yieldFilter: YieldFilterDO;
	private _yieldFilterService: YieldFiltersService;

	public get yieldFilterService(): YieldFiltersService {
		return this._yieldFilterService;
	}
	public set yieldFilterService(yieldFilterService: YieldFiltersService) {
		this._yieldFilterService = yieldFilterService;
	}
	public get yieldFilter(): YieldFilterDO {
		return this._yieldFilter;
	}
	public set yieldFilter(yieldFilter: YieldFilterDO) {
		this._yieldFilter = yieldFilter;
	}
}