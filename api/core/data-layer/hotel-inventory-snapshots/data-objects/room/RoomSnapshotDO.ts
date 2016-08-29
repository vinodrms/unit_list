import {BaseDO} from '../../../common/base/BaseDO';
import {IRoom} from '../../../rooms/data-objects/IRoom';

export class RoomSnapshotDO extends BaseDO implements IRoom {
    id: string;
    categoryId: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "categoryId"];
    }
}