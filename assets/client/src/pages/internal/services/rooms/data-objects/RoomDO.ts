import {BaseDO} from '../../../../../common/base/BaseDO';

export enum RoomStatus {
    Active,
    Deleted
}

export enum RoomMaintenanceStatus {
    Cleaning,
    Dirty,
    CheckInReady
}

export class RoomDO extends BaseDO {
    id: string;
    versionId: number;
    name: string;
    floor: number;
    categoryId: string;
    bedIdList: string[];
    amenityIdList: string[];
    attributeIdList: string[];
    fileUrlList: string[];
    description: string;
    notes: string;
    maintenanceStatus: RoomMaintenanceStatus;
    status: RoomStatus;
    
    constructor() {
        super();
    }
    
    protected getPrimitivePropertyKeys(): string[] {
		return ["id", "versionId", "name", "floor", "categoryId", "bedIdList", "amenityIdList",
            "attributeIdList", "fileUrlList", "description", "notes", "maintenanceStatus", "status"];
	}
    
    public buildFromObject(object: Object) {
        super.buildFromObject(object);
    }
}