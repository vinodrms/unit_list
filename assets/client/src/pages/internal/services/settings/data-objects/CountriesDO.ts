import {BaseDO} from '../../../../../common/base/BaseDO';
import {CountryDO} from '../../common/data-objects/country/CountryDO';

import * as _ from "underscore";

export class CountriesDO extends BaseDO {
	countryList: CountryDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.countryList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "countryList"), (countryObject: Object) => {
			var countryDO = new CountryDO();
			countryDO.buildFromObject(countryObject);
			this.countryList.push(countryDO);
		});
	}

	public getCountryByCode(countryCode: string): CountryDO {
		return _.find(this.countryList, (country: CountryDO) => {
			return country.code === countryCode;
		});
	}
}