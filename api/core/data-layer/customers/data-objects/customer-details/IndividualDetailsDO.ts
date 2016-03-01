import {BaseDO} from '../../../common/base/BaseDO';
import {AddressDO} from '../../../common/data-objects/address/AddressDO';

export class IndividualDetailsDO extends BaseDO {
	constructor() {
		super();
	}
	firstName: string;
	lastName: string;
	address: AddressDO;
	email: string;
	phone: string;
	passportNo: string;

	protected getPrimitivePropertyKeys(): string[] {
		return ["firstName", "lastName", "email", "phone", "passportNo"];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);
		this.address = new AddressDO();
		this.address.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "address"));
	}
}