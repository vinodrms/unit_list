import {BaseDO} from '../../../../../common/base/BaseDO';

export class ResetPasswordDO extends BaseDO {
	email: string;
	
	protected getPrimitivePropertyKeys(): string[] {
		return ["email"];
	}
}