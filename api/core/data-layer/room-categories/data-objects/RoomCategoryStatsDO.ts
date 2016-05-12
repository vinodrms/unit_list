import {BaseDO} from '../../common/base/BaseDO';
import {RoomCategoryDO} from './RoomCategoryDO';
import {BedConfigCapacityDO, RoomCapacityDO} from '../../rooms/data-objects/RoomStatsDO';

export class RoomCategoryStatsDO extends BaseDO {
    constructor() {
        super();
    }
    
    noOfRooms: number;
    roomCategory: RoomCategoryDO;
    capacity: RoomCapacityDO;
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["noOfRooms"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);
        
        this.capacity = new RoomCapacityDO();
        this.capacity.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "capacity"));
        
        this.roomCategory = new RoomCategoryDO();
        this.roomCategory.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "roomCategory"));
    }
}