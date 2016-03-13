import {RoomCategoryDO} from '../../../../data-layer/room-categories/data-objects/RoomCategoryDO';
import {BaseDO} from '../../../../data-layer/common/base/BaseDO';

export class RoomCategoryStatsDO extends BaseDO {
    constructor() {
        super();
    }
    
    roomCategory: RoomCategoryDO;
    noOfRooms: number;
    maxNoAdults: number;
    maxNoChildren: number;
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["noOfRooms", "maxNoOfAdults", "maxNoOfChildren"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);
        
        this.roomCategory = new RoomCategoryDO();
        this.roomCategory.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "roomCategory"));
    }
}