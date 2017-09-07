import {BaseDO} from '../../../../../common/base/BaseDO';

export class SignUpDO extends BaseDO {
	hotelName: string;
    email: string;
	password: string;
	passwordConfirmation: string;
	firstName: string;
	lastName: string;
	signupCode: string;

	protected getPrimitivePropertyKeys(): string[] {
		return ["hotelName", "email", "password", "passwordConfirmation", "firstName", "lastName", "signupCode"];
	}
}