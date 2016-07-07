import {BaseDO} from '../../../../../common/base/BaseDO';
import {ConfigCapacityDO} from '../../common/data-objects/bed-config/ConfigCapacityDO';
import {RoomCategoryDO} from './RoomCategoryDO';

export class RoomCategoryCapacityDO extends BaseDO {
    constructor() {
        super();
    }
    
    stationaryCapacity: ConfigCapacityDO;
    rollawayCapacity: ConfigCapacityDO;
    
    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }
    
    public buildFromObject(object: Object) {
        super.buildFromObject(object);
        
        this.stationaryCapacity = new ConfigCapacityDO();
        this.stationaryCapacity.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "stationaryCapacity"));
        
        this.rollawayCapacity = new ConfigCapacityDO();
        this.rollawayCapacity.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "rollawayCapacity"));
    }
    
    public get totalCapacity(): ConfigCapacityDO {
        var totalRoomCapacity = new ConfigCapacityDO();
        totalRoomCapacity.noBabies = this.stationaryCapacity.noBabies + this.rollawayCapacity.noBabies;
        totalRoomCapacity.noAdults = this.stationaryCapacity.noAdults + this.rollawayCapacity.noAdults;
        totalRoomCapacity.noChildren = this.stationaryCapacity.noChildren + this.rollawayCapacity.noChildren;
        return totalRoomCapacity;
    }
    
    public isEmpty(): boolean {
        return this.totalCapacity.noAdults === 0 && this.totalCapacity.noChildren === 0 && this.totalCapacity.noBabies === 0;
    }
}

export class RoomCategoryStatsDO extends BaseDO {
    constructor() {
        super();
    }
    
    noOfRooms: number;
    roomCategory: RoomCategoryDO;
    capacity: RoomCategoryCapacityDO;
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["noOfRooms"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);
        
        this.capacity = new RoomCategoryCapacityDO();
        this.capacity.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "capacity"));
        
        this.roomCategory = new RoomCategoryDO();
        this.roomCategory.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "roomCategory"));
    }
}