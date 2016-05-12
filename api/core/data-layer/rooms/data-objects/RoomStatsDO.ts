import {RoomDO} from './RoomDO';
import {BaseDO} from '../../common/base/BaseDO';

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

export class RoomCapacityDO extends BaseDO {
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
}

export class RoomStatsDO extends BaseDO {
    constructor() {
        super();
    }
    
    room: RoomDO;
    capacity: RoomCapacityDO;
    
    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);
        
        this.capacity = new RoomCapacityDO();
        this.capacity.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "capacity"));
        
        this.room = new RoomDO();
        this.room.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "room"));
    }
}