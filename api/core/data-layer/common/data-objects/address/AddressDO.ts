import {BaseDO} from '../../base/BaseDO';

export class AddressDO extends BaseDO {
	constructor() {
		super();
	}
	streetAddress: string;
	city: string;
	country: string;
	postalCode: string;

	protected getPrimitiveProperties(): string[] {
		return ["streetAddress", "city", "country", "postalCode"];
	}
}