import {BaseDO} from '../../../../../../common/base/BaseDO';

export enum CommissionType {
	Fixed, Percentage
}

export interface ICommissionDO {
    type: CommissionType;
	amount?: number;
}

export class CommissionDO extends BaseDO implements ICommissionDO{
    constructor() {
        super();
    }
    
	type: CommissionType;
	amount: number;

	protected getPrimitivePropertyKeys(): string[] {
        return ["type", "amount"];
    }
    
    public buildFromObject(object: Object) {
		super.buildFromObject(object);
    }

}