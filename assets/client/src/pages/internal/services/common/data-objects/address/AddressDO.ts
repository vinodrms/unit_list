import {BaseDO} from '../../../../../../common/base/BaseDO';
import {CountryDO} from '../country/CountryDO';

export class AddressDO extends BaseDO {
	constructor() {
		super();
	}
	streetAddress: string;
	city: string;
	country: CountryDO;
	postalCode: string;

	protected getPrimitivePropertyKeys(): string[] {
		return ["streetAddress", "city", "postalCode"];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);
		this.country = new CountryDO();
		this.country.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "country"));
	}
}