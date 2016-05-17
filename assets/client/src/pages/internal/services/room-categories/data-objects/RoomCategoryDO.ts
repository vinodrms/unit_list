import {BaseDO} from '../../../../../common/base/BaseDO';
import {BedConfigDO} from './bed-config/BedConfigDO';

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
    bedConfig: BedConfigDO;
    status: RoomCategoryStatus;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "versionId", "hotelId", "displayName", "status"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.bedConfig = new BedConfigDO;
        this.bedConfig.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "bedConfig"));
    }
}