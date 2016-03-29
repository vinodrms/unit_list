import {BaseDO} from '../../../../../../common/base/BaseDO';
import {UserContactDetailsDO} from './UserContactDetailsDO';
import {Locales} from '../../../../../../common/utils/localization/ThTranslation';

export enum UserRoles {
	Administrator
}

export class UserDO extends BaseDO {
	id: string;
	contactDetails: UserContactDetailsDO;
	email: string;
	roleList: UserRoles[];
	lastLoggedIn: number;
	language: Locales;
	
	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "email", "roleList", "lastLoggedIn", "language"];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.contactDetails = new UserContactDetailsDO();
		this.contactDetails.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "contactDetails"));
	}
}