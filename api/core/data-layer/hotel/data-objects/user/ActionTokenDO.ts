import {BaseDO} from '../../../common/base/BaseDO';

export class ActionTokenDO extends BaseDO {
	constructor() {
		super();
	}
	code: string;
	expiryTimestamp: number;
	updatedTimestamp: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["code", "expiryTimestamp", "updatedTimestamp"];
	}
}