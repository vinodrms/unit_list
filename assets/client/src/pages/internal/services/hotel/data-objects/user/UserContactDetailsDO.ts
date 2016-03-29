import {BaseDO} from '../../../../../../common/base/BaseDO';
import {AddressDO} from '../../../common/data-objects/address/AddressDO';

export class UserContactDetailsDO extends BaseDO {
	constructor() {
		super();
	}
	address: AddressDO;
	phone: string;
	firstName: string;
	lastName: string;

	protected getPrimitivePropertyKeys(): string[] {
		return ["phone", "firstName", "lastName"];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.address = new AddressDO();
		this.address.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "address"));
	}
}