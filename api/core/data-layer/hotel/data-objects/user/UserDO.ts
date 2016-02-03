import {BaseDO} from '../../../common/base/BaseDO';
import {UserContactDetailsDO} from './UserContactDetailsDO';
import {Locales} from '../../../../utils/localization/Translation';

export enum AccountStatus {
	Active,
	Pending,
	Disabled
}
export enum UserRoles {
	Administrator
}

export class UserDO extends BaseDO {
	constructor() {
		super();
	}
	contactDetails: UserContactDetailsDO;
	email: string;
	password: string;
	accountStatus: AccountStatus;

	activationCode: string;
	activationExpiryTimestamp: number;

	roles: UserRoles[];
	lastLoggedIn: number;
	language: Locales;

	protected getPrimitiveProperties(): string[] {
		return ["email", "password", "accountStatus", "activationCode", "activationExpiryTimestamp", "roles", "lastLoggedIn", "language"];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.contactDetails = new UserContactDetailsDO();
		this.contactDetails.buildFromObject(object["contactDetails"]);
	}
}