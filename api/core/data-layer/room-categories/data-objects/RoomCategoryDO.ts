import {BaseDO} from '../../common/base/BaseDO';

export class RoomCategoryDO extends BaseDO {
    constructor() {
        super();
    }
    
    id: string;
    versionId: number;
    hotelId: string;
    displayName: string;
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "versionId", "hotelId", "displayName"];
    }
    
    public buildFromObject(object: Object) {
		super.buildFromObject(object);
    }
}