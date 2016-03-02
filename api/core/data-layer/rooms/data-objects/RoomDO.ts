import {BaseDO} from '../../common/base/BaseDO';

export enum RoomStatus {
    Active,
    Deleted
}

export enum RoomMaintenanceStatus {
    Cleaning,
    Dirty
}

export class RoomDO extends BaseDO {
    constructor() {
        super();
    }

    id: string;
    versionId: number;
    hotelId: string;
    name: string;
    floor: number;
    categoryId: string;
    bedIdList: string[];
    amenityIdList: string[];
    attributeIdList: string[];
    notes: string;
    maintenanceStatus: RoomMaintenanceStatus;
    status: RoomStatus;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "versionId", "hotelId", "name", "floor", "categoryId", "bedIdList", "amenityIdList",
            "attributeIdList", "notes", "maintenanceStatus", "status"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);
    }
}