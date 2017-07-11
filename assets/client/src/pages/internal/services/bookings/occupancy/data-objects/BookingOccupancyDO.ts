import { BaseDO } from '../../../../../../common/base/BaseDO';
import { ThUtils } from '../../../../../../common/utils/ThUtils';

import * as _ from "underscore";

export class BookingOccupancyDO extends BaseDO {
    private _thUtils: ThUtils;

    indexedRoomCategoryIdOccupancy: { [id: string]: number; };
    indexedRoomIdOccupancy: { [id: string]: number; };
    indexedAllotmentIdOccupancy: { [id: string]: number; };

    constructor() {
        super();
        this._thUtils = new ThUtils();
    }

    protected getPrimitivePropertyKeys(): string[] {
        return ["indexedRoomCategoryIdOccupancy", "indexedRoomIdOccupancy", "indexedAllotmentIdOccupancy"];
    }

    public getOccupancyForRoomCategoryId(roomCategoryId: string): number {
        return this.getOccupancyForObjectKey(roomCategoryId, this.indexedRoomCategoryIdOccupancy);
    }
    public getOccupancyForRoomId(roomId: string): number {
        return this.getOccupancyForObjectKey(roomId, this.indexedRoomIdOccupancy);
    }
    public getOccupancyForAllotmentId(allotmentId: string): number {
        return this.getOccupancyForObjectKey(allotmentId, this.indexedAllotmentIdOccupancy);
    }
    private getOccupancyForObjectKey(objectKey: string, indexedOccupancy: { [id: string]: number; }): number {
        var occupancy = indexedOccupancy[objectKey];
        if (this._thUtils.isUndefinedOrNull(occupancy) || !_.isNumber(occupancy)) {
            return 0;
        }
        return occupancy;
    }
}