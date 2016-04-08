import {BaseDO} from '../../../../../common/base/BaseDO';

export enum RoomCategoryStatus {
    Active,
    Deleted
}

export class RoomCategoryDO extends BaseDO {
    constructor() {
        super();
    }
    
    id: string;
    versionId: number;
    hotelId: string;
    displayName: string;
    status: RoomCategoryStatus;
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "versionId", "hotelId", "displayName", "status"];
    }
    
    public buildFromObject(object: Object) {
		super.buildFromObject(object);
    }
}