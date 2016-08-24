import {PriceProductDO} from '../../../../data-layer/price-products/data-objects/PriceProductDO';
import {ThDateIntervalDO} from '../../../../utils/th-dates/data-objects/ThDateIntervalDO';
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
		priceProduct.price.roundPricesToTwoDecimals();
	}

	private getDefaultIntervals(): ThDateIntervalDO[] {
		var minDate = this._thDateUtils.getMinThDateDO();
		var maxDate = this._thDateUtils.getMaxThDateDO();
		var defaultIntervalList: ThDateIntervalDO[] = [
			ThDateIntervalDO.buildThDateIntervalDO(minDate, maxDate)
		];
		return defaultIntervalList;
	}
}