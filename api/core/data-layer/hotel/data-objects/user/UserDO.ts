import {BaseDO} from '../../../common/base/BaseDO';
import {UserContactDetailsDO} from './UserContactDetailsDO';
import {ActionTokenDO} from './ActionTokenDO';
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

	accountActivationToken: ActionTokenDO;
	resetPasswordToken: ActionTokenDO;

	roles: UserRoles[];
	lastLoggedIn: number;
	language: Locales;

	protected getPrimitivePropertyKeys(): string[] {
		return ["email", "password", "accountStatus", "roles", "lastLoggedIn", "language"];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.contactDetails = new UserContactDetailsDO();
		this.contactDetails.buildFromObject(object["contactDetails"]);
		
		this.accountActivationToken = new ActionTokenDO();
		this.accountActivationToken.buildFromObject(object["accountActivationToken"]);
		
		this.resetPasswordToken = new ActionTokenDO();
		this.resetPasswordToken.buildFromObject(object["resetPasswordToken"]);
	}
}