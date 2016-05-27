import {BaseDO} from '../../../../../common/base/BaseDO';
import {RoomCategoryDO} from './RoomCategoryDO';

export class BedConfigCapacityDO extends BaseDO {
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

export class RoomCategoryCapacityDO extends BaseDO {
    constructor() {
        super();
    }
    
    stationaryCapacity: BedConfigCapacityDO;
    rollawayCapacity: BedConfigCapacityDO;
    
    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }
    
    public buildFromObject(object: Object) {
        super.buildFromObject(object);
        
        this.stationaryCapacity = new BedConfigCapacityDO();
        this.stationaryCapacity.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "stationaryCapacity"));
        
        this.rollawayCapacity = new BedConfigCapacityDO();
        this.rollawayCapacity.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "rollawayCapacity"));
    }
    
    public get totalCapacity(): BedConfigCapacityDO {
        var totalRoomCapacity = new BedConfigCapacityDO();
        totalRoomCapacity.maxNoBabies = this.stationaryCapacity.maxNoBabies + this.rollawayCapacity.maxNoBabies;
        totalRoomCapacity.maxNoAdults = this.stationaryCapacity.maxNoAdults + this.rollawayCapacity.maxNoAdults;
        totalRoomCapacity.maxNoChildren = this.stationaryCapacity.maxNoChildren + this.rollawayCapacity.maxNoChildren;
        return totalRoomCapacity;
    }
    
    public canFit(capacityToCheck: BedConfigCapacityDO): boolean {
        if(this.totalCapacity.maxNoAdults < capacityToCheck.maxNoAdults) return false;
        if(this.totalCapacity.maxNoChildren < capacityToCheck.maxNoChildren) return false;
        if(this.totalCapacity.maxNoBabies < capacityToCheck.maxNoBabies) return false;
        return true;
    }
    
    public isEmpty(): boolean {
        return this.totalCapacity.maxNoAdults === 0 && this.totalCapacity.maxNoChildren === 0 && this.totalCapacity.maxNoBabies === 0;
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