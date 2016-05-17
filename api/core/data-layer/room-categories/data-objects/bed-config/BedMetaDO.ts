import {BaseDO} from '../../../common/base/BaseDO';

export class BedMetaDO extends BaseDO {
    bedId: string;
    noOfInstances: number;

    constructor() {
        super();
    }

    protected getPrimitivePropertyKeys(): string[] {
        return ["bedId", "noOfInstances"];
    }
}