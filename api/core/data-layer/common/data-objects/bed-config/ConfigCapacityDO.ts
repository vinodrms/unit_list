import {BaseDO} from '../../../common/base/BaseDO';

export class ConfigCapacityDO extends BaseDO {
    constructor() {
        super();
    }
    
    noBabies: number;
    noAdults: number;
    noChildren: number;
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["noBabies", "noAdults", "noChildren"];
    }
}