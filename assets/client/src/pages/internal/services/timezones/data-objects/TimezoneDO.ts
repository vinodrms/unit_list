import {BaseDO} from '../../../../../common/base/BaseDO';

export class TimezoneDO extends BaseDO {
	name: string;
    
	constructor() {
		super();
	}
    
	protected getPrimitivePropertyKeys(): string[] {
		return ["name"];
	}
}