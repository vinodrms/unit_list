import { BaseDO } from '../../../../../../common/base/BaseDO';
import { TransactionFeeDO } from "./TransactionFeeDO";

export class PaymentMethodDO extends BaseDO {
    constructor() {
        super();
    }
    id: string;
    name: string;
    iconUrl: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "name", "iconUrl"];
    }
}