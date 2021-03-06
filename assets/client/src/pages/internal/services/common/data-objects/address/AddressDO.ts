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
	public toString(): string {
		var addressString = "";
		addressString = this.appendString(addressString, this.city);
		addressString = this.appendString(addressString, this.streetAddress);
		addressString = this.appendString(addressString, this.postalCode);
		if (this.country) {
			addressString = this.appendString(addressString, this.country.name);
		}
		if (addressString.length == 0) { addressString = "n/a"; }
		return addressString;
	}
	private appendString(initialString: string, toAppendString: string): string {
		if (!toAppendString) {
			return initialString;
		}
		if (initialString.length > 0) {
			initialString += ", ";
		}
		initialString += toAppendString;
		return initialString;
	}
}