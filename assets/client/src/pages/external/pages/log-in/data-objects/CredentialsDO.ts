import {BaseDO} from '../../../../../common/base/BaseDO';

export class CredentialsDO extends BaseDO {
	email: string;
    password: string;
	
	protected getPrimitivePropertyKeys(): string[] {
		return ["email", "password"];
	}
}