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
        totalRoomCapacity.noBabies = this.stationaryCapacity.noBabies + this.rollawayCapacity.noBabies;
        totalRoomCapacity.noAdults = this.stationaryCapacity.noAdults + this.rollawayCapacity.noAdults;
        totalRoomCapacity.noChildren = this.stationaryCapacity.noChildren + this.rollawayCapacity.noChildren;
        return totalRoomCapacity;
    }

    public canFit(capacityToCheck: ConfigCapacityDO): boolean {
        return this.canFitCore(this.totalCapacity, capacityToCheck);
    }
    public canFitInStationaryBeds(capacityToCheck: ConfigCapacityDO): boolean {
        return this.canFitCore(this.stationaryCapacity, capacityToCheck);
    }

    private canFitCore(referenceCapacity: ConfigCapacityDO, capacityToCheck: ConfigCapacityDO): boolean {
        if (referenceCapacity.noAdults < capacityToCheck.noAdults) return false;

        var maxChildrenCapacity = referenceCapacity.noChildren;
        // the adults are replaceable with a child
        maxChildrenCapacity += (referenceCapacity.noAdults - capacityToCheck.noAdults);
        if (maxChildrenCapacity < capacityToCheck.noChildren) return false;

        if (referenceCapacity.noBabies < capacityToCheck.noBabies) return false;
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