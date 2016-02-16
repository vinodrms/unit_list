import {BaseDO} from '../../base/BaseDO';

export class CountryDO extends BaseDO {
    constructor() {
        super();
    }
    code: string;
    name: string;
    inEU: boolean;
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["code", "name", "inEU"];
    }
}