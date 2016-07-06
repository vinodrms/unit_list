import {BaseDO} from '../../../common/base/BaseDO';
import {UserContactDetailsDO} from './UserContactDetailsDO';
import {ActionTokenDO} from './ActionTokenDO';
import {Locales} from '../../../../utils/localization/ThTranslation';

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
	id: string;
	contactDetails: UserContactDetailsDO;
	email: string;
	password: string;
	accountStatus: AccountStatus;

	accountActivationToken: ActionTokenDO;
	resetPasswordToken: ActionTokenDO;

	roleList: UserRoles[];
	lastLoggedIn: number;
	language: Locales;

	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "email", "password", "accountStatus", "roleList", "lastLoggedIn", "language"];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.contactDetails = new UserContactDetailsDO();
		this.contactDetails.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "contactDetails"));
		
		this.accountActivationToken = new ActionTokenDO();
		this.accountActivationToken.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "accountActivationToken"));
		
		this.resetPasswordToken = new ActionTokenDO();
		this.resetPasswordToken.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "resetPasswordToken"));
	}
}