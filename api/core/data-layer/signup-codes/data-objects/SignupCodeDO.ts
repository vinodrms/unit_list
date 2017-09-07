import {BaseDO} from '../../common/base/BaseDO';

export class SignupCodeDO extends BaseDO {
    id: string;
    value: string;

    constructor() {
        super();
    }
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "value"];
    }
}