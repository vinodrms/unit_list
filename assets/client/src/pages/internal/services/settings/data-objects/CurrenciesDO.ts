import {BaseDO} from '../../../../../common/base/BaseDO';
import {CurrencyDO} from '../../common/data-objects/currency/CurrencyDO';

export class CurrenciesDO extends BaseDO {
	currencyList: CurrencyDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.currencyList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "currencyList"), (countryObject: Object) => {
			var currencyDO = new CurrencyDO();
			currencyDO.buildFromObject(countryObject);
			this.currencyList.push(currencyDO);
		});
	}

	public getCurrencyByCode(currencyCode: string): CurrencyDO {
		return _.find(this.currencyList, (currency: CurrencyDO) => {
			return currency.code === currencyCode;
		});
	}
}