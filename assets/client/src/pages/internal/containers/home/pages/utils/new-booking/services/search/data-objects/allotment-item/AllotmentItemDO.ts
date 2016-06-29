import {BaseDO} from '../../../../../../../../../../../common/base/BaseDO';
import {AllotmentDO} from '../../../../../../../../../services/allotments/data-objects/AllotmentDO';

export class AllotmentItemDO extends BaseDO {
    allotment: AllotmentDO;
    noTotalAllotments: number;
    noOccupiedAllotments: number;
    priceProductId: string;

    constructor() {
        super();
    }

    protected getPrimitivePropertyKeys(): string[] {
        return ["noTotalAllotments", "noOccupiedAllotments", "priceProductId"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.allotment = new AllotmentDO();
        this.allotment.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "allotment"));
    }
}