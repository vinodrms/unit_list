import {BaseDO} from '../../../../../common/base/BaseDO';

export class UpdatePasswordDO extends BaseDO {
	password: string;
	passwordConfirmation: string;
	activationCode: string;
	email: string;

	protected getPrimitivePropertyKeys(): string[] {
		return ["password", "passwordConfirmation"];
	}
}