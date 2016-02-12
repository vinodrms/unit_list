import {BaseDO} from '../../base/BaseDO';

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