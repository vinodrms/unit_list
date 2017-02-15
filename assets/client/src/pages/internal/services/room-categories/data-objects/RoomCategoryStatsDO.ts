import { BaseDO } from '../../../../../common/base/BaseDO';
import { RoomCategoryDO } from './RoomCategoryDO';
import { ConfigCapacityDO } from '../../common/data-objects/bed-config/ConfigCapacityDO';
import { BedStatsDO } from './bed-stats/BedStatsDO';

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
        totalRoomCapacity.noAdults = this.stationaryCapacity.noAdults + this.rollawayCapacity.noAdults;
        totalRoomCapacity.noChildren = this.stationaryCapacity.noChildren + this.rollawayCapacity.noChildren;
        totalRoomCapacity.noBabies = this.stationaryCapacity.noBabies + this.rollawayCapacity.noBabies;
        totalRoomCapacity.noBabyBeds = this.stationaryCapacity.noBabyBeds + this.rollawayCapacity.noBabyBeds;
        return totalRoomCapacity;
    }

    public isEmpty(): boolean {
        return this.totalCapacity.noAdults === 0 && this.totalCapacity.noChildren === 0
            && this.totalCapacity.noBabies === 0 && this.totalCapacity.noBabyBeds === 0;
    }

    public canFit(capacityToCheck: ConfigCapacityDO): boolean {
        return this.canFitCore(this.totalCapacity, capacityToCheck);
    }

    public canFitInStationaryCapacity(capacityToCheck: ConfigCapacityDO): boolean {
        return this.canFitCore(this.stationaryCapacity, capacityToCheck);
    }

    private canFitCore(referenceCapacity: ConfigCapacityDO, capacityToCheck: ConfigCapacityDO): boolean {
        if (referenceCapacity.noAdults < capacityToCheck.noAdults) return false;
        let noAdultsRemaining = referenceCapacity.noAdults - capacityToCheck.noAdults;

        // the remainig adults from the reference capacity can be used as children
        let maxChildrenCapacity = referenceCapacity.noChildren + noAdultsRemaining;
        if (maxChildrenCapacity < capacityToCheck.noChildren) return false;

        let noChildrenRemaining = referenceCapacity.noChildren - capacityToCheck.noChildren;
        // the remainig adults and children from the reference capacity can be used as babies
        let maxBabyCapacity = referenceCapacity.noBabies + noAdultsRemaining + noChildrenRemaining;
        if (maxBabyCapacity < capacityToCheck.noBabies) return false;

        if (referenceCapacity.noBabyBeds < capacityToCheck.noBabyBeds) return false;
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
    bedStatsList: BedStatsDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["noOfRooms"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.capacity = new RoomCategoryCapacityDO();
        this.capacity.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "capacity"));

        this.roomCategory = new RoomCategoryDO();
        this.roomCategory.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "roomCategory"));

        this.bedStatsList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "bedStatsList"), (statsObject: Object) => {
            var stats = new BedStatsDO();
            stats.buildFromObject(statsObject);
            this.bedStatsList.push(stats);
        });
    }
}