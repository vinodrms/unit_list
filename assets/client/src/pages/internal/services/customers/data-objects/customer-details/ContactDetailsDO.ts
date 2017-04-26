import { BaseDO } from '../../../../../../common/base/BaseDO';

export class ContactDetailsDO extends BaseDO {
	constructor() {
		super();
	}
	contactName: string;
	phone: string;
	fax: string;
	email: string;


	protected getPrimitivePropertyKeys(): string[] {
		return ["contactName", "phone", "fax", "email"];
	}

    public buildFromObject(object: Object) {
		super.buildFromObject(object);
    }
}