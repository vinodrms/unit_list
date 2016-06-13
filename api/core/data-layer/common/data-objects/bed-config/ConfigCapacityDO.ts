import {BaseDO} from '../../../common/base/BaseDO';

export class ConfigCapacityDO extends BaseDO {
    constructor() {
        super();
    }
    
    maxNoBabies: number;
    maxNoAdults: number;
    maxNoChildren: number;
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["maxNoBabies", "maxNoAdults", "maxNoChildren"];
    }
}