import {BaseDO} from '../../../../../common/base/BaseDO';

export class RoomCategoryDO extends BaseDO {
    constructor() {
        super();
    }

    id: string;
    versionId: number;
    displayName: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "versionId", "displayName"];
    }
}