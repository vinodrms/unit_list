import {BaseDO} from '../../../../../../../../../../../common/base/BaseDO';
import {RoomCategoryStatsDO} from '../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';

export class RoomCategoryItemDO extends BaseDO {
    constructor() {
        super();
    }

    stats: RoomCategoryStatsDO;
    noOccupiedRooms: number;
    priceProductIdList: string[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["noOccupiedRooms", "priceProductIdList"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.stats = new RoomCategoryStatsDO();
        this.stats.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "stats"));
    }

    public get availableRooms(): number {
        return this.stats.noOfRooms - this.noOccupiedRooms;
    }
}