import { BaseDO } from '../../../../../../common/base/BaseDO';

export enum CommissionType {
    Fixed, Percentage
}

export class CommissionDO extends BaseDO {
    constructor() {
        super();
    }

    type: CommissionType;
    amount: number;
    deducted: boolean;

    protected getPrimitivePropertyKeys(): string[] {
        return ["type", "amount", "deducted"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);
    }

}