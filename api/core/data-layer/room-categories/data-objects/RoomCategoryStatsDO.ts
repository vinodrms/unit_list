import {BaseDO} from '../../common/base/BaseDO';
import {RoomCategoryDO} from './RoomCategoryDO';

export class RoomCategoryStatsDO extends BaseDO {
    constructor() {
        super();
    }
    
    roomCategory: RoomCategoryDO;
    maxNoAdults: number;
    maxNoChildren: number;
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["maxNoOfAdults", "maxNoOfChildren"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);
        
        this.roomCategory = new RoomCategoryDO();
        this.roomCategory.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "roomCategory"));
    }
}