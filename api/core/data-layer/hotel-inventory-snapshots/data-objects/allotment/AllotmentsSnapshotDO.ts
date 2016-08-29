import {BaseDO} from '../../../common/base/BaseDO';

export class AllotmentsSnapshotDO extends BaseDO {
    activeAllotmentIdList: string[];
    totalNoOfRooms: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["activeAllotmentIdList", "totalNoOfRooms"];
    }
}