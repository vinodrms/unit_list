import {PriceProductDO} from '../../../../data-layer/price-products/data-objects/PriceProductDO';
import {ThDayInYearIntervalDO} from '../../../../utils/th-dates/data-objects/ThDayInYearIntervalDO';
import {ThDateUtils} from '../../../../utils/th-dates/ThDateUtils';

export class PriceProductActionUtils {
	private _thDateUtils: ThDateUtils;
	constructor() {
		this._thDateUtils = new ThDateUtils();
	}

	public populateDefaultIntervalsOn(priceProduct: PriceProductDO) {
		priceProduct.openIntervalList = this.getDefaultIntervals();
		priceProduct.openForArrivalIntervalList = this.getDefaultIntervals();
		priceProduct.openForDepartureIntervalList = this.getDefaultIntervals();
	}

	private getDefaultIntervals(): ThDayInYearIntervalDO[] {
		var minDate = this._thDateUtils.getMinThDateDO();
		var maxDate = this._thDateUtils.getMaxThDateDO();
		var defaultIntervalList: ThDayInYearIntervalDO[] = [
			ThDayInYearIntervalDO.buildThDayInYearIntervalDO(minDate, maxDate)
		];
		return defaultIntervalList;
	}
}