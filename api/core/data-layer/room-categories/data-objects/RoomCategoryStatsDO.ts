import {BaseDO} from '../../common/base/BaseDO';
import {RoomCategoryDO} from './RoomCategoryDO';
import {ConfigCapacityDO} from '../../common/data-objects/bed-config/ConfigCapacityDO';

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
        totalRoomCapacity.maxNoBabies = this.stationaryCapacity.maxNoBabies + this.rollawayCapacity.maxNoBabies;
        totalRoomCapacity.maxNoAdults = this.stationaryCapacity.maxNoAdults + this.rollawayCapacity.maxNoAdults;
        totalRoomCapacity.maxNoChildren = this.stationaryCapacity.maxNoChildren + this.rollawayCapacity.maxNoChildren;
        return totalRoomCapacity;
    }
    
    public canFit(capacityToCheck: ConfigCapacityDO): boolean {
        if(this.totalCapacity.maxNoAdults < capacityToCheck.maxNoAdults) return false;
        if(this.totalCapacity.maxNoChildren < capacityToCheck.maxNoChildren) return false;
        if(this.totalCapacity.maxNoBabies < capacityToCheck.maxNoBabies) return false;
        return true;
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