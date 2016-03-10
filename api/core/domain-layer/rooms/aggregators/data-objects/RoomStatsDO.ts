import {RoomDO} from '../../../../data-layer/rooms/data-objects/RoomDO';
import {BaseDO} from '../../../../data-layer/common/base/BaseDO';

export class RoomStatsDO extends BaseDO {
    constructor() {
        super();
    }
    
    room: RoomDO;
    maxNoAdults: number;
    maxNoChildren: number;
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["maxNoAdults", "maxNoChildren"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);
        
        this.room = new RoomDO();
        this.room.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "room"));
    }
}